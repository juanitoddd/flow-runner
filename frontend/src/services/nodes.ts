import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Node, Edge } from "reactflow";

export type NodeState = 'idle' | 'running' | 'error' | 'success'

export const nodesApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:5000/" }),
  tagTypes: ['Nodes'],
  reducerPath: "nodesApi",
  endpoints: (builder) => ({
    // Get all nodes (python files inside the ../nodes dir)
    getNodes: builder.query<any, void>({
      query: () => `nodes/`,
      providesTags: ["Nodes"],
      transformResponse: (res: any) => res.output.map((_name: string, _i:number): Node => ({
        id: `${_i}`,
        type: "python",
        data: {
          id: _i,
          label: `${_name}`,
          state: 'idle',
          output: [] 
        },        
        position: { x: 250, y: _i * 120 },
        style: {
          minWidth: 150
        }
      }))
    }),
    getNodeFlowName: builder.query({
      query: (name: string) => `nodes/`,
    }),
  }),
});

// DEPRECATED
export const runNode = (_name: string) => {  
  const eventSource = new EventSource(`http://127.0.0.1:5000/nodes/run/${_name}`);
  // const eventSource = new EventSource(`http://127.0.0.1:5000/nodes/debug`);
  eventSource.onmessage = (e) => {
    console.log('data', e.data);
    if(e.data === 'finished') {
      eventSource.close();      
    }
  } 
  eventSource.onopen = (e) => console.log('open',e);
  eventSource.onerror = (e) => {      
    console.log('error',e);
    eventSource.close();    
  }
}

// Export hooks for usage in functional components
export const { useGetNodesQuery } = nodesApi;
export default nodesApi
