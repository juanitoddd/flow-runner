import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../store/store";
import { Node, Edge } from "reactflow";
import nodesApi from '../../services/nodes';

export interface NodesState {
  nodes: Node[];
  edges: Edge[]  
}

const initialState: NodesState = {
  nodes: [],
  edges: [],
};

export const nodesSlice = createSlice({
  name: "nodes",
  initialState,  
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(nodesApi.endpoints.getNodes.matchFulfilled, (state, action) => {
      state.nodes = action.payload.output.map((_name: string, _i:number) => ({
        id: `${_i}`,
        type: "python",
        data: { label: `${_name}` },
        position: { x: 250, y: _i * 120 }
      }))
    })
  },
});

export const { } = nodesSlice.actions;

export const selectNodes = (state: RootState) => state.nodes.nodes;
export const selecEdges = (state: RootState) => state.nodes.edges;


export default nodesSlice.reducer;
