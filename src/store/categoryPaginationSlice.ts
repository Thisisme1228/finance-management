import { createSlice } from "@reduxjs/toolkit";

type CategoryPaginationState = {
  isFirstPage: boolean;
};

const initialState: CategoryPaginationState = {
  isFirstPage: false,
};

const categoryPaginationSlice = createSlice({
  name: "categoryPaginationSlice",
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

export const { returnFirstPage, cancel } = categoryPaginationSlice.actions;
export default categoryPaginationSlice.reducer;
