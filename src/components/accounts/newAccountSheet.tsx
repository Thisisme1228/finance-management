import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { close } from "./newAccountSlice";
import { RootState } from "./store";

const NewAccountSheet = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.newAccount.isOpen);

  return (
    <Sheet open={isOpen} onOpenChange={() => dispatch(close())}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;
