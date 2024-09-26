import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { close } from "@/store/transactionSlice";
import { returnFirstPage } from "@/store/transactionPaginationSlice";
import { RootState } from "@/store";
import { TransactionForm } from "./form";
import { TransactionsValues } from "@/lib/validation";
import { useSubmitTransactionMutation } from "@/app/(main)/transactions/mutations/add";
import { useEditTransactionMutation } from "@/app/(main)/transactions/mutations/edit";

const TransactionSheet = () => {
  const dispatch = useDispatch();
  const addMutation = useSubmitTransactionMutation();
  const editMutation = useEditTransactionMutation();

  const { isOpen, data } = useSelector(
    (state: RootState) => state.transactionModal
  );
  const onSubmit = (name: TransactionsValues, id?: string) => {
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
        <TransactionForm
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

export default TransactionSheet;
