import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { close } from "@/store/accountSlice";
import { returnFirstPage } from "@/store/accountPaginationSlice";
import { RootState } from "@/store";
import { AccountForm } from "./form";
import { AccountValues } from "@/lib/validation";
import { useSubmitAccountMutation } from "@/app/(main)/accounts/mutations/add";
import { useEditAccountMutation } from "@/app/(main)/accounts/mutations/edit";

const AccountSheet = () => {
  const dispatch = useDispatch();
  const addMutation = useSubmitAccountMutation();
  const editMutation = useEditAccountMutation();

  const { isOpen, data } = useSelector(
    (state: RootState) => state.accountModal
  );
  const onSubmit = (name: AccountValues, id?: string) => {
    if (id) {
      editMutation.mutate(
        { name: name.name, id },
        {
          onSuccess: (res) => {
            if (!res.error) dispatch(close());
          },
        }
      );
    } else {
      addMutation.mutate(name, {
        onSuccess: (res) => {
          if (res.status === "201") {
            dispatch(returnFirstPage());
          }
          if (!res.error) dispatch(close());
        },
      });
    }
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(isOpen) => !isOpen && dispatch(close())}
    >
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>{data?.title}</SheetTitle>
          <SheetDescription>{data?.subtitle}</SheetDescription>
        </SheetHeader>
        <AccountForm
          isPending={addMutation.isPending || editMutation.isPending}
          onSubmit={onSubmit}
          disabled={false}
          buttonText={data?.buttonText as string}
          id={data?.id}
          defaultValues={{
            name: data?.name || "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default AccountSheet;
