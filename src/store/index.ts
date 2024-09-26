import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./accountSlice";
import accountPaginationModal from "./accountPaginationSlice";
import transactionReducer from "./transactionSlice";
import transactionPaginationModal from "./transactionPaginationSlice";

const store = configureStore({
  reducer: {
    accountModal: accountReducer,
    accountPaginationModal: accountPaginationModal,
    transactionModal: transactionReducer,
    transactionPaginationModal: transactionPaginationModal,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
