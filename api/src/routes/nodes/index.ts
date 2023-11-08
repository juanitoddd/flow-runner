import type { FastifyInstance } from "fastify";
import { PythonShell } from "python-shell";
import path from "path";
import fs from "fs/promises";

//joining path of directory
const dirScriptsPath = path.join(process.cwd(), "../scripts/");
const dirCommonPath = path.join(process.cwd(), "../scripts/common");
const dirCustomPath = path.join(process.cwd(), "../scripts/custom");

const options = {
  mode: "text" as "text",
  pythonOptions: ["-u"], // get print results in real-time
  scriptPath: "../scripts/common",
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const getMainFn = async (file: string) => {
  // Extract inputs/output fn from module
  const filepath = path.join(dirCommonPath, file);
  const content = await fs.readFile(filepath, "utf8");
  const regex =
    /def\s*main\s*\(((\w+\s*,*\s*)*)\)\s*:(.|\t|\n)*return\s*(\w)/gm;
  const regex2 = /def\s*main\s*\(((\w+\s*,*\s*:*\w*)*)\)\s*:(.|\t|\n)*return\s*(\w)/gm // Accepts types
  const parts: string[] = [];
  let inputs, output;
  let m;
  while ((m = regex.exec(content)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      // console.log(`Found match, group ${groupIndex}: ${match}`);
      parts.push(match);
      if (groupIndex === 1)
        inputs = match
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== "");
      if (groupIndex === 4) output = match;
    });
  }
  if (parts.length === 0) return [];
  return [inputs, output];
};

export default async (fastify: FastifyInstance) => {
  fastify.get("/", {}, async function (req, res) {
    const common = (await fs.readdir(dirCommonPath)).filter((f: string) =>
      f.includes(".py")
    );
    const nodes = await Promise.all(
      common.map(async (_file: string) => {
        const [inputs, output] = await getMainFn(_file);
        return {
          name: _file,
          inputs,
          output,
        };
      })
    );
    console.log("🚀 ~ nodes:", nodes);
    const custom = (await fs.readdir(dirCustomPath)).filter((f: string) =>
      f.includes(".py")
    );
    return { statusCode: 200, output: nodes };
  });

  fastify.get("/code/:file", {}, async function (req, res) {
    const { file } = req.params as any;
    if (!file)
      return { statusCode: 200, output: `No file was found with name ${file}` };
    const filepath = path.join(dirCommonPath, file);
    const content = await fs.readFile(filepath, "utf8");
    return { statusCode: 200, output: content, id: file };
  });

  fastify.get("/read/:file", {}, async (req, res) => {
    const { file } = req.params as any;
    if (!file)
      return { statusCode: 200, output: `No file was found with name ${file}` };
    const [inputs, output] = await getMainFn(file);
    if (!inputs || !output)
      return {
        statusCode: 200,
        output: `No proper main fn was found in file ${file}`,
      };
    return { statusCode: 200, output: { inputs, output } };
  });
  
  fastify.get("/write", {}, async (req, res) => {
    let code = '';
    code += `from add import main as add_main\n`;    
    code += `data = add_main(1, 2)\n`;
    code += `print(data)\n`    
    code += `f = open('./outputs/add', 'w')\nf.write(str(data))\nf.close()\n`;

    const filepath = path.join(dirCommonPath, 'runner.py');
    let response = await fs.writeFile(filepath, code);
    console.log("response", response)
    
    const shell = new PythonShell('runner.py', options);
    let i = 0;
    res.code(200);
    res.headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    let error = false;
    res.sse({ id: String(i), data: "__initializing__" });
    shell.on("message", async function (message) {
      console.log("message", message);
      res.sse({ id: String(i++), data: message });
    });
    shell.on("stderr", async function (stderr) {
      res.sse({ id: String(i++), data: stderr.toString() });
      error = true;
      // res.sseContext.source.end()
    });
    shell.on("close", async function () {
      if (error) res.sse({ id: String(i++), data: "__error__" });
      else res.sse({ id: String(i++), data: "__finished__" });
      res.sseContext.source.end();
      return;
    });    
  })

  // event-stream
  fastify.get("/exec/:file", {}, async (req, res) => {
    const { file } = req.params as any;
    if (!file)
      return { statusCode: 200, output: `No file was found with name ${file}` };
    let i = 0;
    res.code(200);
    res.headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    let error = false;

    const [inputs, output] = await getMainFn(file);
    if (!inputs || !output)
      return {
        statusCode: 200,
        output: `No proper main fn was found in file ${file}`,
      };

    const moduleName = file.replace(".py", "");
    let code = '';
    code += `from common.${moduleName} import main as ${moduleName}_main\n`;
    console.log("inputs", inputs)
    // TODO: Read from previuos outputs
    inputs.map((input: string, _i:number) => {
      code += `${input} = ${_i + 1}\n`;
    })
    code += `data = ${moduleName}_main(${inputs.join(',')})\n`;
    // code += `print(data)\n`
    code += `f = open('./outputs/add', 'w')\nf.write(str(data))\nf.close()\n`;    
  
    // Create runner
    const filepath = path.join(dirScriptsPath, 'runner.py');
    let response = await fs.writeFile(filepath, code);
    console.log("response", response)

    const shell = new PythonShell('runner.py', {...options, scriptPath: "../scripts"});
    // res.sse({ id: String(i), data: `Initializing ${file}`});
    res.sse({ id: String(i), data: "__initializing__" });
    shell.on("message", async function (message) {
      console.log("message", message);
      res.sse({ id: String(i++), data: message });
    });
    shell.on("stderr", async function (stderr) {
      res.sse({ id: String(i++), data: stderr.toString() });
      error = true;
      // res.sseContext.source.end()
    });
    shell.on("close", async function () {
      if (error) res.sse({ id: String(i++), data: "__error__" });
      else res.sse({ id: String(i++), data: "__finished__" });
      res.sseContext.source.end();
      return;
    });
  });

  // event-stream
  fastify.get("/run/:file", {}, async (req, res) => {
    const { file } = req.params as any;
    if (!file)
      return { statusCode: 200, output: `No file was found with name ${file}` };
    let i = 0;
    res.code(200);
    res.headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    let error = false;
    const shell = new PythonShell(file, options);
    // res.sse({ id: String(i), data: `Initializing ${file}`});
    res.sse({ id: String(i), data: "__initializing__" });
    shell.on("message", async function (message) {
      console.log("message", message);
      res.sse({ id: String(i++), data: message });
    });
    shell.on("stderr", async function (stderr) {
      res.sse({ id: String(i++), data: stderr.toString() });
      error = true;
      // res.sseContext.source.end()
    });
    shell.on("close", async function () {
      if (error) res.sse({ id: String(i++), data: "__error__" });
      else res.sse({ id: String(i++), data: "__finished__" });
      res.sseContext.source.end();
      return;
    });
  });

  // TODO: run complete pipeline event-stream
  fastify.get("/pipeline", {}, async (req, res) => {
    const { file } = req.params as any;
    if (!file)
      return { statusCode: 200, output: `No file was found with name ${file}` };
    let i = 0;
    res.code(200);
    res.headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    let error = false;
    const shell = new PythonShell(file, options);
    // res.sse({ id: String(i), data: `Initializing ${file}`});
    res.sse({ id: String(i), data: "__initializing__" });
    shell.on("message", async function (message) {
      console.log("message", message);
      res.sse({ id: String(i++), data: message });
    });
    shell.on("stderr", async function (stderr) {
      res.sse({ id: String(i++), data: stderr.toString() });
      error = true;
      // res.sseContext.source.end()
    });
    shell.on("close", async function () {
      if (error) res.sse({ id: String(i++), data: "__error__" });
      else res.sse({ id: String(i++), data: "__finished__" });
      res.sseContext.source.end();
      return;
    });
  });

  // event-stream
  fastify.get("/debug", async function (req, res) {
    res.code(200);
    res.headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    const shell = new PythonShell("debug.py", options);
    res.sse({ id: "0", data: `Initializing debug.py` });
    shell.on("message", async function (message) {
      console.log("message", message);
      // res.raw.write(message)
      res.sse({ data: message });
    });
    shell.on("stderr", async function (stderr) {
      console.log("stderr", stderr);
      res.sse({ data: "error" });
      res.sseContext.source.end();
    });
    shell.on("close", async function () {
      res.sse({ data: "finished" });
      res.sseContext.source.end();
      return;
    });
  });

  // event-stream
  fastify.get("/test", async function (req, res) {
    for (let i = 0; i < 10; i++) {
      await sleep(2000);
      res.sse({ id: String(i), data: "Some message" });
    }
  });
};
