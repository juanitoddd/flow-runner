import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const nodesApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:5000/" }),
  tagTypes: [],
  reducerPath: "nodesApi",
  endpoints: (builder) => ({
    // Get all nodes (python files inside the ../nodes dir)
    getNodes: builder.query({
      query: () => `nodes/`,
    }),
    getNodeFlowName: builder.query({
      query: (name: string) => `nodes/`,
    }),
  }),
});

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
