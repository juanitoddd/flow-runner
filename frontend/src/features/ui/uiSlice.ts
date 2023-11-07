import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  rightPanel: string; // 'output' | 'editor'
}

const initialState: UiState = {
  rightPanel: "output",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setRightPanel: (state, action: PayloadAction<string>) => {
      state.rightPanel = action.payload;
    },
  },
});

export const { setRightPanel } = uiSlice.actions;

export default uiSlice.reducer;
