import { TransactionData } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TransactionState = {
  isOpen: boolean;
  data?: TransactionData | null;
};

const initialState: TransactionState = {
  isOpen: false,
  data: null,
};

const transactionSlice = createSlice({
  name: "transactionModal",
  initialState,
  reducers: {
    open: (state, action: PayloadAction<any>) => {
      state.isOpen = true;
      state.data = action.payload;
    },
    close: (state) => {
      state.isOpen = false;
    },
  },
});

export const { open, close } = transactionSlice.actions;
export default transactionSlice.reducer;
