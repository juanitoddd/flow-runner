import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../store/store";
import { Node, Edge } from "reactflow";
import nodesApi, { NodeState } from "../../services/nodes";

export interface FlowState {
  id?: string
  initial?: string
  name: string
  nodes: Node[];
  edges: Edge[];
  state: string;
}

const initialState: FlowState = {
  name: 'myFlow',  
  nodes: [],
  edges: [],
  state: "idle",
};

export const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    setInitial: (state, action: PayloadAction<string>) => {            
      state.initial = action.payload;
    },
    addNode: (state, action: PayloadAction<Node>) => {            
      state.nodes.push(action.payload);
    },
    removeNode: (state, action: PayloadAction<string>) => {
      const idx = state.nodes.findIndex((_node: Node) => _node.id === action.payload)
      if(idx > -1) state.nodes.splice(idx, 1);
    },
    updateNodePosition: (state, action: PayloadAction<any>) => {      
      const idx = state.nodes.findIndex((_node: Node) => _node.id === action.payload.id)
      state.nodes[idx].position = action.payload.position
    },    
    addFlowEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
    },
    removeFlowEdge: (state, action: PayloadAction<string>) => {
      const idx = state.edges.findIndex((_edge: Edge) => _edge.id === action.payload)
      if(idx > -1) state.edges.splice(idx, 1);      
    },
  },
  /*
  extraReducers: (builder) => {
    builder
      .addCase(runningNode.pending, (state, action: PayloadAction<void>) => {
        // console.log("RunNode.pending");
      })
      .addCase(runningNode.fulfilled, (state, action: PayloadAction<void>) => {
        state.runningNode = null;
        // console.log("RunNode.fulfilled");
      })
      .addCase(runningNode.rejected, (state) => {
        state.runningNode = null;
        // console.log("RunNode.rejected");
      });
    builder.addMatcher(
      nodesApi.endpoints.getNodes.matchFulfilled,
      (state, action) => {
        state.nodes = action.payload;
      }
    );    
  },
  */
});

export const { setInitial, addNode, removeNode, updateNodePosition, addFlowEdge, removeFlowEdge } = flowSlice.actions;

export default flowSlice.reducer;