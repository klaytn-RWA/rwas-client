import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import toastReducer from "./reducers/toastReducer";

const createStore = () => {
  return configureStore({
    reducer: {
      toast: toastReducer,
      asset: assetReducer,
    },
  });
};

export let store = createStore();

export const refreshStore = () => {
  store = createStore();
};

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import assetReducer from "./reducers/assetReducer";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type StoreType = typeof store;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
