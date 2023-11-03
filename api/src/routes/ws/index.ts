import type { FastifyInstance } from 'fastify'

// https://www.fastify.io/docs/latest/Reference/Routes/#shorthand-declaration
export default async (fastify: FastifyInstance) => {
  // Add schema so they can be shared and referred
  // routes definitions

  fastify.get(
    '/',
    { websocket: true },
    (connection /* SocketStream */, req /* FastifyRequest */) => {
      connection.socket.on('message', (message) => {
        // message.toString() === 'hi from client'
        connection.socket.send('hi from server')
      })
    }
  )

  fastify.get(
    '/*',
    { websocket: true },
    (connection /* SocketStream */, req /* FastifyRequest */) => {
      connection.socket.on('message', (message) => {
        // message.toString() === 'hi from client'
        connection.socket.send('hi from server')
      })
    }
  )
}
