"use client";

import React, { ReactNode } from 'react';
import NewAccountSheet from "./newAccountSheet";
import { useMountedState } from "react-use";
import { Provider } from "react-redux";
import store from "@/components/accounts/store";

const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <NewAccountSheet />
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
