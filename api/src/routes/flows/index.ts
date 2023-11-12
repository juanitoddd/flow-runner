import type { FastifyInstance } from 'fastify'

import {
  flowSchema,
  flowNotFoundSchema,
  getFlowsSchema,
  getFlowByIdSchema,
  createFlowSchema,
  updateFlowSchema,
  deleteFlowSchema
} from './schema'

import {
  getFlows,
  getFlowById,
  createFlow,
  updateFlow,
  deleteFlow,
  getFlowsPaged
} from './model'

// https://www.fastify.io/docs/latest/Reference/Routes/#shorthand-declaration
export default async (fastify: FastifyInstance) => {
  // Add schema so they can be shared and referred
  fastify.addSchema(flowSchema)
  fastify.addSchema(flowNotFoundSchema)
  // routes definitions
  fastify.get('/', { schema: getFlowsSchema }, getFlows)
  // fastify.get('/', { schema: getFlowsSchema }, getFlowsPaged)
  fastify.get('/:id', { schema: getFlowByIdSchema }, getFlowById)
  fastify.post('/', { schema: createFlowSchema }, createFlow)
  fastify.put('/:id', { schema: updateFlowSchema }, updateFlow)
  fastify.delete('/:id', { schema: deleteFlowSchema }, deleteFlow)
}
