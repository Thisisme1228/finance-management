import { AccountData } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AccountState = {
  isOpen: boolean;
  data?: AccountData | null;
};

const initialState: AccountState = {
  isOpen: false,
  data: null,
};

const accountSlice = createSlice({
  name: "accountModal",
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

export const { open, close } = accountSlice.actions;
export default accountSlice.reducer;
