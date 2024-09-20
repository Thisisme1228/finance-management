"use client";

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

const SheetProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <SheetProvider />
      {children}
    </Provider>
  );
};

export default SheetProviderWrapper;
