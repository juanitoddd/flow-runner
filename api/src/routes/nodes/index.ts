import type { FastifyInstance } from 'fastify'
import { PythonShell } from 'python-shell'
import path from 'path'
import fs from 'fs/promises'

//joining path of directory
const directoryPath = path.join(process.cwd(), '../scripts')

const options = {
  mode: 'text' as 'text',
  pythonOptions: ['-u'], // get print results in real-time
  scriptPath: '../scripts'
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export default async (fastify: FastifyInstance) => {
  fastify.get('/', {}, async function (req, res) {
    const files = await fs.readdir(directoryPath)
    return { statusCode: 200, output: files }
  })

  // event-strea,
  fastify.get('/run/:file', {}, async (req, res) => {
    const { file } = req.params as any
    if (!file)
      return { statusCode: 200, output: `No file was found with name ${file}` }
    let i = 0
    res.code(200)
    res.headers({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    })
    let error = false
    const shell = new PythonShell(file, options)
    // res.sse({ id: String(i), data: `Initializing ${file}`});
    res.sse({ id: String(i), data: '__initializing__' })
    shell.on('message', async function (message) {
      console.log('message', message)
      // res.raw.write(message)
      res.sse({ id: String(i++), data: message })
    })
    shell.on('stderr', async function (stderr) {
      res.sse({ id: String(i++), data: stderr.toString() })
      error = true
      // res.sseContext.source.end()
    })
    shell.on('close', async function () {
      if (error) res.sse({ id: String(i++), data: '__error__' })
      else res.sse({ id: String(i++), data: '__finished__' })
      res.sseContext.source.end()
      return
    })
  })

  // event-stream
  fastify.get('/debug', async function (req, res) {
    res.code(200)
    res.headers({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    })
    const shell = new PythonShell('debug.py', options)
    res.sse({ id: '0', data: `Initializing debug.py` })
    shell.on('message', async function (message) {
      console.log('message', message)
      // res.raw.write(message)
      res.sse({ data: message })
    })
    shell.on('stderr', async function (stderr) {
      console.log('stderr', stderr)
      res.sse({ data: 'error' })
      res.sseContext.source.end()
    })
    shell.on('close', async function () {
      res.sse({ data: 'finished' })
      res.sseContext.source.end()
      return
    })
  })

  // event-stream
  fastify.get('/test', async function (req, res) {
    for (let i = 0; i < 10; i++) {
      await sleep(2000)
      res.sse({ id: String(i), data: 'Some message' })
    }
  })
}
