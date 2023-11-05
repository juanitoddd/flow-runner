import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import type { PreloadedState } from "@reduxjs/toolkit";

// Reducers
import counterReducer from "../features/counter/counterSlice";
import nodesReducer from "../features/nodes/nodesSlice";
// import { pokemonApi } from "../services/pokemon";
import { postsApi } from "../services/posts";
import { nodesApi } from '../services/nodes';

const rootReducer = combineReducers({
  // [postsApi.reducerPath]: postsApi.reducer,
  // [pokemonApi.reducerPath]: pokemonApi.reducer,
  [nodesApi.reducerPath]: nodesApi.reducer,
  counter: counterReducer,
  nodes: nodesReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
      getDefaultMiddleware().concat(nodesApi.middleware),
    preloadedState,
  });
};

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<typeof rootReducer>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
