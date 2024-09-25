"use client";

import React, { ReactNode } from "react";
import AccountSheet from "./accountSheet";
import { Provider } from "react-redux";
import store from "@/app/store";

const SheetProvider = () => {
  return (
    <>
      <AccountSheet />
    </>
  );
};

interface Props {
  children: ReactNode;
}

const SheetProviderWrapper: React.FC<Props> = ({ children }) => {
  return (
    <Provider store={store}>
      <SheetProvider />
      {children}
    </Provider>
  );
};

export default SheetProviderWrapper;
