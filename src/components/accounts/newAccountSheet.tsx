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
import { AccountForm } from "./account-form";
import { AccountValues } from "@/lib/validation";
import { useSubmitAccountMutation } from "./mutations";

const NewAccountSheet = () => {
  const dispatch = useDispatch();
  const mutation = useSubmitAccountMutation();

  const isOpen = useSelector((state: RootState) => state.newAccount.isOpen);
  const onSubmit = (name: AccountValues) => {
    mutation.mutate(name, {
      onSuccess: (res) => {
        if (!res.error) dispatch(close());
      },
    });
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(isOpen) => !isOpen && dispatch(close())}
    >
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          isPending={mutation.isPending}
          onSubmit={onSubmit}
          disabled={false}
          defaultValues={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;
