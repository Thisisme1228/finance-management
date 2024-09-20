import { configureStore } from "@reduxjs/toolkit";
import newAccountReducer from "./newAccountSlice";

const store = configureStore({
  reducer: {
    newAccount: newAccountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
