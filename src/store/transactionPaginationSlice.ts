import { createSlice } from "@reduxjs/toolkit";

type TransactionPaginationState = {
  isFirstPage: boolean;
};

const initialState: TransactionPaginationState = {
  isFirstPage: false,
};

const transactionPaginationSlice = createSlice({
  name: "transactionPaginationSlice",
  initialState,
  reducers: {
    returnFirstPage: (state) => {
      state.isFirstPage = true;
    },
    cancel: (state) => {
      state.isFirstPage = false;
    },
  },
});

export const { returnFirstPage, cancel } = transactionPaginationSlice.actions;
export default transactionPaginationSlice.reducer;
