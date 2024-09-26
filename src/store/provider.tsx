"use client";

import React, { ReactNode } from "react";
import AccountSheet from "@/components/accounts/sheet";
import CategorySheet from "@/components/categories/sheet";
import { Provider } from "react-redux";
import store from "@/store";

interface Props {
  children: ReactNode;
}

const ReduxProviderWrapper: React.FC<Props> = ({ children }) => {
  return (
    <Provider store={store}>
      <AccountSheet />
      <CategorySheet />
      {children}
    </Provider>
  );
};

export default ReduxProviderWrapper;
