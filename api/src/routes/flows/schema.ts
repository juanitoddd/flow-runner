// https://davipon.hashnode.dev/better-backend-dx-json-schema-typescript-swagger-vol-1#heading-stop-typing-twice

import { FastifySchema } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

// Entity schema
export const flowSchema = {
  $id: 'flow',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    nodes: {
      type: 'array',
      items: {
        type: 'object', 
        properties: {
          id: { type: "string" },
          // type: { type: "string" },
          data: { type: 'object' },
          position: { 
            type: 'object',
            properties: {
              x: { type: "number" },
              y: { type: 'number' },
            }
          },
        }
      },
    },
    edges: {
      type: 'array',
      items: {
        type: 'object', 
        properties: {
          id: { type: "string" },
          type: { type: "string" },
          data: { type: 'object' },
          source: { type: "string" },
          target: { type: "string" },        
        }
      },
    },
    state: { type: 'string' },    
  },
  required: ['name']
} as const

// Body schema
export type Flow = FromSchema<typeof flowSchema>

// Not found schema
export const flowNotFoundSchema = {
  $id: 'flowNotFound',
  type: 'object',
  required: ['error'],
  properties: {
    error: { type: 'string' }
  },
  additionalProperties: false
} as const

// Flow not found schema
export type FlowNotFound = FromSchema<typeof flowNotFoundSchema>

// Params schema
const paramsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' }
  },
  additionalProperties: false
} as const

export type Params = FromSchema<typeof paramsSchema>

// Query schema
const querystringSchema = {
  type: 'object',
  properties: {
    deleted: {
      type: 'boolean',
      description: 'True/False to return deleted records',
      default: false
    },
    page: { type: 'number', description: 'Requested page', default: 1 },
    perPage: {
      type: 'number',
      description: 'Rows for pages requested',
      default: 2
    }
  },
  additionalProperties: false
} as const

export type Querystring = FromSchema<typeof querystringSchema>

// Response schema
const replySchema = {
  type: 'object',
  properties: {
    // Return array of flows object
    flows: {
      type: 'array',
      items: { $ref: 'flow#' }
    }
  },
  additionalProperties: false
} as const

export type Reply = FromSchema<
  typeof replySchema,
  { references: [typeof flowSchema] }
>

// ---------
// Route schemas are composed of request, response schemas, and extra property
// so that @fastify/swagger can automatically generate OpenAPI spec & Swagger UI
// ---------

/* Get all flows */
export const getFlowsSchema: FastifySchema = {
  tags: ['flows'],
  description: 'Get flows',
  querystring: querystringSchema,
  response: {
    200: {
      ...replySchema
    }
  }
}

/* Get flow by ID */
export const getFlowByIdSchema: FastifySchema = {
  tags: ['flows'],
  description: 'Get a flow by id',
  params: paramsSchema,
  response: {
    200: {
      ...replySchema
    },
    404: {
      description: 'The flow was not found',
      $ref: 'flowNotFound#'
    }
  }
}

/* Create a flow */
export const createFlowSchema: FastifySchema = {
  tags: ['flows'],
  description: 'Create a new flow',
  body: flowSchema,
  response: {
    201: {
      description: 'The flow was created',
      headers: {
        Location: {
          type: 'string',
          description: 'URL of the new resource'
        }
      },
      // Return newly created resource as the body of the response
      ...flowSchema
    }
  }
}

/* Put */
export const updateFlowSchema: FastifySchema = {
  tags: ['flows'],
  description: 'Update a flow',
  params: paramsSchema,
  body: flowSchema,
  response: {
    204: {
      description: 'The flow was updated',
      type: 'null'
    },
    404: {
      description: 'The flow was not found',
      $ref: 'flowNotFound#'
    }
  }
}

/* Delete */
export const deleteFlowSchema: FastifySchema = {
  tags: ['flows'],
  description: 'Delete a flow',
  params: paramsSchema,
  response: {
    204: {
      description: 'The flow was deleted',
      type: 'null'
    },
    404: {
      description: 'The flow was not found',
      $ref: 'flowNotFound#'
    }
  }
}
