// https://ship.paralect.com/docs/api/testing#example

import { type RouteHandler } from 'fastify'
import { Params, Querystring, Flow, Reply, FlowNotFound } from './schema.js'
import { collections } from '../../common/collections.js'
import { v4 as uuidv4 } from 'uuid'

import { Database } from '@paralect/node-mongo'

import config from '../../common/config.js'

const database = new Database(config.mongo.connection)
const flowsService = database.createService<Flow>('flows', {})

/**
 * Get all flows
 */
export const getFlows: RouteHandler<{
  Querystring: Querystring
  Reply: Reply | FlowNotFound
}> = async function (req, reply) {  

  await database.connect()

  const { results } = await flowsService.find({})
  console.log("results", results)
  // database.close()

  results.length > 0
    ? reply.code(200).send({ flows: results })
    : reply.code(404).send({ error: 'Flow not found' })
}

/**
 * Get all flows paginated
 */
export const getFlowsPaged: RouteHandler<{
  Querystring: Querystring
  Reply: Reply | FlowNotFound
}> = async function (req, reply) {
  const { deleted, page, perPage } = req.query

  await database.connect()

  const { results } = await flowsService.find(
    { deleted: deleted },
    { page: page, perPage: perPage }
  )

  results.length > 0
    ? reply.code(200).send({ flows: results })
    : reply.code(404).send({ error: 'Flow not found' })
}

/**
 * Get flow by ID
 */
export const getFlowById: RouteHandler<{
  Params: Params
  Reply: Reply | FlowNotFound
}> = async function (req, reply) {
  const { id } = req.params

  const collection = this.mongo.db?.collection(collections.flows)

  const flow = await collection?.findOne<Flow>({
    id: id
  })

  flow
    ? reply.code(200).send({ flows: [flow] })
    : reply.code(404).send({ error: 'Flow not found' })
}

/**
 * POST Add a new flow
 */
export const createFlow: RouteHandler<{
  Body: Flow
  Reply: Reply
}> = async function (req, reply) {
  const newFlow = {
    id: uuidv4(),
    ...req.body
  }

  const collection = this.mongo.db?.collection(collections.flows)  
  const result = collection?.insertOne(newFlow)

  result
    ? reply.code(201).header('Location', `/flows/${newFlow.id}`)
    : reply.internalServerError
}

/**
 * PUT Update a flow
 */
export const updateFlow: RouteHandler<{
  Params: Params
  Body: Flow
  Reply: FlowNotFound
}> = async function (req, reply) {
  const { id } = req.params

  const collection = this.mongo.db?.collection(collections.flows)

  const filter = {
    id: id
  }

  const updateDoc = {
    $set: { ...req.body }
  }

  const flow = collection?.findOneAndUpdate(filter, updateDoc, {
    returnDocument: 'after'
  })

  flow
    ? reply.code(204).send()
    : reply.code(304).send({ error: `Flow ${filter.id} not updated` })
}

/**
 * DELETE Delete a flow
 * @param req
 * @param reply
 */
export const deleteFlow: RouteHandler<{
  Params: Params
  Reply: Reply | FlowNotFound
}> = async function (req, reply) {
  const { id } = req.params
  const collection = this.mongo.db?.collection(collections.flows)
  const result = await collection?.deleteOne({
    id: id
  })

  if (result && result.deletedCount) {
    reply.code(202).send({ error: `Successfully removed flow with id ${id}` })
  } else if (!result) {
    reply.code(400).send({ error: `Failed to remove flow with id ${id}` })
  } else if (!result.deletedCount) {
    reply.code(404).send({ error: `Flow with id ${id} does not exist` })
  }
}
