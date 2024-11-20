import { baseApi } from "@/api/baseApi";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const reducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseApi.middleware
    ),
});

export default store;
