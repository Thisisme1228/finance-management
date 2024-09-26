import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./accountSlice";
import accountPaginationModal from "./accountPaginationSlice";
import categoryReducer from "./categorySlice";
import categoryPaginationModal from "./categoryPaginationSlice";

const store = configureStore({
  reducer: {
    accountModal: accountReducer,
    accountPaginationModal: accountPaginationModal,
    categoryModal: categoryReducer,
    categoryPaginationModal: categoryPaginationModal,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
