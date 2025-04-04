// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./slices/globalSlice";
import customizationReducer from "./customizationReducer";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    customization: customizationReducer,
  },
});
