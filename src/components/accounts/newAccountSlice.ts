import { createSlice } from "@reduxjs/toolkit";

type NewAccountState = {
  isOpen: boolean;
};

const initialState: NewAccountState = {
  isOpen: false,
};

const newAccountSlice = createSlice({
  name: "newAccount",
  initialState,
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
  },
});

export const { open, close } = newAccountSlice.actions;
export default newAccountSlice.reducer;
