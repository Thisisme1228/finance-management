import { createSlice } from "@reduxjs/toolkit";

type AccountPaginationState = {
  isFirstPage: boolean;
};

const initialState: AccountPaginationState = {
  isFirstPage: false,
};

const accountPaginationSlice = createSlice({
  name: "accountPaginationSlice",
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

export const { returnFirstPage, cancel } = accountPaginationSlice.actions;
export default accountPaginationSlice.reducer;
