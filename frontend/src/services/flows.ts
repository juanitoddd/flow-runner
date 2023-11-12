import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Node, Edge } from "reactflow";

export interface Flow {
  id: string;
  nodes: any[];
  edge: any[];
  state: string
}

type FlowsResponse = Flow[];

export type FlowState = "idle" | "running" | "error" | "success";

interface apiResponse {
  statusCode: number;
  output: any;
}

export const flowsApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:5000/" }),
  tagTypes: ["Flow"],
  reducerPath: "flowApi",
  endpoints: (builder) => ({    
    getFlow: builder.query<Flow, string>({
      query: (id) => `flows/${id}`,
      providesTags: (result, error, id) => [{ type: "Flow", id }],
    }),
    getFlows: builder.query<FlowsResponse, void>({
      query: () => "flows",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Flow" as const, id })),
              { type: "Flow", id: "LIST" },
            ]
          : [{ type: "Flow", id: "LIST" }],
    }),    
    addFlow: builder.mutation<Flow, Partial<Flow>>({      
      query: (body) => ({
        url: `flows`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Flow", id: "LIST" }],
    }),
    updateFlow: builder.mutation<void, Pick<Flow, "id"> & Partial<Flow>>({
      query: ({ id, ...patch }) => ({
        url: `flows/${id}`,
        method: "PUT",
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          flowsApi.util.updateQueryData("getFlow", id, (draft) => {
            Object.assign(draft, patch);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Flow", id }],
    }),
    deleteFlow: builder.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `flows/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [{ type: "Flow", id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {   
  useGetFlowQuery,
  useGetFlowsQuery,
  useAddFlowMutation,
  useUpdateFlowMutation,
  useDeleteFlowMutation 
} = flowsApi;

export default flowsApi;
