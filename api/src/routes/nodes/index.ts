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
  
  /*
  // No types regex
    match[1]: inputs
    match[4]: output
  */
 const regex = /def\s*main\s*\(((\w+\s*,*\s*)*)\)\s*:(.|\t|\n)*return\s*(\w)/gm;

  /*
  Inputs types regex
    match[1]: inputs & types
    match[4]: output
  */
  const regex2 = /def\s*main\s*\(\s*((\w+\s*:\s*\w+\s*,*\s*)*)\)\s*:(.|\t|\n)*return\s*(\w)/gm // Accepts input types
  
  /*
  Inputs/Output types regex
    match[1]: inputs & types
    match[3]: output type
    match[5]: output
  */
  const regex3 = /def\s*main\s*\(\s*((\w+\s*:\s*\w+\s*,*\s*)*)\)\s*->\s*(\w+)\s*:(.|\t|\n)*return\s*(\w)/gm // Accept input/outputs types
  
  /*
  Fn Info
    match[1]: Info
  */
  const info = /@info\s*((\w*\s*)+)(?=\n)/gm
  let m;
  let infoStr = ''
  while ((m = info.exec(content)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex3.lastIndex) regex3.lastIndex++;    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {     
      // console.log("match", match)  
      if (groupIndex === 1) infoStr = match
    });    
  }

  const parts: string[] = [];
  let inputs, outputName, outputType;  
  while ((m = regex3.exec(content)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex3.lastIndex) regex3.lastIndex++;    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      // console.log(`Found match, group ${groupIndex}: ${match}`);
      parts.push(match);
      if (groupIndex === 1)
        inputs = match
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== "")
          .map((s) => s.split(':'))
      if (groupIndex === 3) outputType = match;
      if (groupIndex === 5) outputName = match;      
    });    
  }
  let output = [outputName, outputType]
  if (parts.length === 0) return [];
  return [inputs, output, infoStr];
};

export default async (fastify: FastifyInstance) => {
  // Get nodes in common
  fastify.get("/", {}, async function (req, res) {
    const common = (await fs.readdir(dirCommonPath)).filter((f: string) =>
      f.includes(".py")
    );
    const nodes = await Promise.all(
      common.map(async (_file: string) => {
        const [inputs, output, info] = await getMainFn(_file);
        return {
          name: _file,
          inputs,
          output,
          info
        };
      })
    );
    console.log("🚀 ~ nodes:", nodes);
    const custom = (await fs.readdir(dirCustomPath)).filter((f: string) =>
      f.includes(".py")
    );
    return { statusCode: 200, output: nodes };
  });

  // Get code of node
  fastify.get("/code/:file", {}, async function (req, res) {
    const { file } = req.params as any;
    if (!file)
      return { statusCode: 200, output: `No file was found with name ${file}` };
    const filepath = path.join(dirCommonPath, file);
    const content = await fs.readFile(filepath, "utf8");
    return { statusCode: 200, output: content, id: file };
  });

  // Get inputs/outputs/info of node
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

  // event-stream
  fastify.get("/exec/:file", {}, async (req, res) => {
    const { file } = req.params as any;
    if (!file)
      return { statusCode: 200, output: `No file was found with name ${file}` };
    let i = 0;    
    let error = false;

    const [inputs, output] = await getMainFn(file);
    console.log("inputs", inputs)
    console.log("output", output)    

    if (!inputs || !output)
      return {
        statusCode: 200,
        output: `No proper main fn was found in file ${file}`,
      };
    
    res.code(200);
    res.headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });    

    const moduleName = file.replace(".py", "");
    let code = '';
    code += `from common.${moduleName} import main as ${moduleName}_main\n`;    
    // TODO: Read from previuos outputs
    const inputVars = []
    inputs.map((input: string[], _i:number) => {
      inputVars.push(input[0])
      code += `${input[0]} = ${_i + 1}\n`;
    })
    code += `data = ${moduleName}_main(${inputVars.join(',')})\n`;
    // code += `print(data)\n`
    code += `f = open('./artifacts/${moduleName}', 'w')\nf.write(str(data))\nf.close()\n`;    
  
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

  // Run single node, no output caching
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
    return { statusCode: 200, output: `todo` };
  });

  // ------- DEBUG fns ---------- //
  
  // Debug write
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
