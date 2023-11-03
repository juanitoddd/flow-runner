import type { FastifyInstance } from 'fastify'
import { PythonShell } from 'python-shell'
import path from 'path'

//joining path of directory
const directoryPath = path.join(process.cwd(), '../nodes')

const options = {
  mode: 'text' as 'text',
  pythonOptions: ['-u'], // get print results in real-time
  scriptPath: '/home/juan/dev/23dev_env/23flow/nodes'
}

export default async (fastify: FastifyInstance) => {
  // Add schema so they can be shared and referred
  // routes definitions
  fastify.get('/run:file', {}, async (req, res) => {
    /*
    const { file } = req.params
    if (file) {
        const output = await cp.exec(`cd ${directoryPath} && python ${file}`)
        console.log('🚀 ~ output:', output)
        return { statusCode: 200, output: output[0] }
    } 
    */
    return { statusCode: 200, output: '' }
  })

  fastify.get('/debug', {}, async (req, res) => {
    const shell = new PythonShell('debug.py', options)
    shell.on('message', function (message) {
      const wss = fastify.websocketServer
      wss.on('connection', function connection(ws) {
        ws.on('error', console.error)
        ws.emit('message', message)
        /*
        ws.on('message', function message(data, isBinary) {
          wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(data, { binary: isBinary })
            }
          })
        })
        */
      })
      console.log('wss', wss)
      // fastify.websocketServer.emit('message', message)
      console.log('results', message)
    })
    // await PythonShell.run('debug.py', options).then((messages) => {})
    return { statusCode: 200, output: '' }
  })
}
