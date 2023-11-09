import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../store/store";
import { Node, Edge } from "reactflow";
import nodesApi, { NodeState } from "../../services/nodes";

export interface NodesState {
  selectedNode: number | null;
  runningNode: number | null;
  nodes: Node[];
  edges: Edge[];
  code: string;
}

const initialState: NodesState = {
  selectedNode: null, // Selection
  runningNode: null, // name of the running node
  nodes: [],
  edges: [],
  code: "",
};

export const findNode = (_name: string | null, _items: Node[]) =>
  _items.findIndex((_node: Node) => _node.data.label === _name);

export const nodesSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    selectNode: (state, action: PayloadAction<number | null>) => {
      state.selectedNode = action.payload;
    },
    runNode: (state, action: PayloadAction<number | null>) => {
      state.runningNode = action.payload;
      state.selectedNode = action.payload; // Run & Select
    },
    resetNodeOuput: (state) => {
      if (state.runningNode !== null) {
        state.nodes[state.runningNode].data.output = [];
      }
    },
    appendToNodeOuput: (state, action: PayloadAction<string | null>) => {
      if (state.runningNode !== null) {
        state.nodes[state.runningNode].data.output.push(action.payload);
      }
    },
    setNodeState: (state, action: PayloadAction<NodeState>) => {
      if (state.runningNode !== null) {
        state.nodes[state.runningNode].data.state = action.payload;
      }
    },
  },
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
    /*
      .addMatcher(
        nodesApi.endpoints.getNodeCode.matchFulfilled,
        (state, action) => {
          console.log("addMatcher", action.payload);
          state.code = action.payload.output;
        }
      );
      */
  },
});

export const runningNode = createAsyncThunk(
  "nodes/runningNode",
  async (node: Node, thunkAPI) => {
    await new Promise<void>((resolve, reject) => {
      thunkAPI.dispatch(nodesSlice.actions.runNode(node.data.id));
      thunkAPI.dispatch(nodesSlice.actions.resetNodeOuput());
      thunkAPI.dispatch(nodesSlice.actions.setNodeState("running"));

      const eventSource = new EventSource(
        `http://127.0.0.1:5000/nodes/exec/${node.data.label}`
      );

      eventSource.onmessage = (e) => {
        // console.log("e", e);
        switch (e.data) {
          case "__initializing__":
            // Nothing
            break;
          case "__error__":
            thunkAPI.dispatch(nodesSlice.actions.setNodeState("error"));
            eventSource.close();
            reject();
            break;
          case "__finished__":
            eventSource.close();
            thunkAPI.dispatch(nodesSlice.actions.setNodeState("success"));
            resolve();
            break;
          default:
            thunkAPI.dispatch(nodesSlice.actions.appendToNodeOuput(e.data));
            break;
        }
      };
      eventSource.onopen = (e) => {
        // console.log('open',e);
      };
      eventSource.onerror = (e) => {
        console.log("error", e);
        eventSource.close();
        thunkAPI.dispatch(nodesSlice.actions.setNodeState("error"));
        reject();
      };
    });
  }
);

export const { runNode, selectNode } = nodesSlice.actions;

export default nodesSlice.reducer;
