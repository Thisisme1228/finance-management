import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./accountSlice";
import accountPaginationModal from "./accountPaginationSlice";
import categoryReducer from "./categorySlice";
import categoryPaginationModal from "./categoryPaginationSlice";
import transactionReducer from "./transactionSlice";
import transactionPaginationModal from "./transactionPaginationSlice";

const store = configureStore({
  reducer: {
    accountModal: accountReducer,
    accountPaginationModal: accountPaginationModal,
    categoryModal: categoryReducer,
    categoryPaginationModal: categoryPaginationModal,
    transactionModal: transactionReducer,
    transactionPaginationModal: transactionPaginationModal,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
