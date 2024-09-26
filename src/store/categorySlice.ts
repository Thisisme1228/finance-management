import { CategoryData } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CategoryState = {
  isOpen: boolean;
  data?: CategoryData | null;
};

const initialState: CategoryState = {
  isOpen: false,
  data: null,
};

const categorySlice = createSlice({
  name: "categoryModal",
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

export const { open, close } = categorySlice.actions;
export default categorySlice.reducer;
