import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Node, Edge } from "reactflow";

export type NodeState = "idle" | "running" | "error" | "success";

interface apiResponse {
  statusCode: number;
  output: any;
}

export const nodesApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:5000/" }),
  tagTypes: ["Nodes", "Code"],
  reducerPath: "nodesApi",
  endpoints: (builder) => ({
    // Get all nodes (python files inside common & custom)
    getNodes: builder.query<any, void>({
      query: () => `nodes/`,
      providesTags: ["Nodes"],
      transformResponse: (res: any) =>
        res.output.map(
          (_name: string, _i: number): Node => ({
            id: `${_i}`,
            type: "python",
            data: {
              id: _i,
              label: `${_name}`,
              state: "idle",
              output: [],
            },
            position: { x: 250, y: _i * 120 },
            style: {
              minWidth: 150,
            },
          })
        ),
    }),
    getNodeCode: builder.query<any, string>({
      query: (name) => `nodes/code/${name}`,
      providesTags: (result, error, id) => [
        { type: "Code", id: result?.output.id },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetNodesQuery, useGetNodeCodeQuery } = nodesApi;
export default nodesApi;
