import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/date-picker";
import { Loader2 } from "lucide-react";
import { Select } from "@/components/select";
import { AmountInput } from "@/components/amount-input";
import { TransactionInfo } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { TransactionsValues, TransactionsSchema } from "@/lib/validation";

type Props = {
  data?: TransactionInfo;
  onSubmit: (values: TransactionInfo, id?: string) => void;
  disabled?: boolean;
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
  isPending?: boolean;
  buttonText?: string;
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
};

export const TransactionForm = ({
  data,
  onSubmit,
  disabled,
  onCreateAccount,
  onCreateCategory,
  isPending,
  buttonText,
  accountOptions,
  categoryOptions,
}: Props) => {
  const [error, setError] = useState<string>();
  // 1. Define your form.
  const form = useForm<TransactionsValues>({
    resolver: zodResolver(TransactionsSchema),
    defaultValues: {
      date: data?.date ? new Date(data.date) : undefined,
      account_id: data?.account_id ?? "",
      category_id: data?.category_id ?? "",
      payee: data?.payee ?? "",
      amount: data?.amount ?? "",
      notes: data?.notes ?? "",
    },
  });

  // 2. Define a submit handler.
  const handleSubmit = (values: TransactionsValues) => {
    if (data?.id) {
      onSubmit({
        ...values,
        notes: values["notes"] ?? "",
        category_id: values["category_id"] ?? "",
        id: data?.id,
      });
    } else {
      onSubmit({
        ...values,
        notes: values["notes"] ?? "",
        category_id: values["category_id"] ?? "",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="account_id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an account"
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="category_id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select a category"
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="payee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Add a payee"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  {...field}
                  disabled={disabled}
                  placeholder="0.00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  disabled={disabled}
                  placeholder="Optional notes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {!isPending ? buttonText : <Loader2 className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
};
