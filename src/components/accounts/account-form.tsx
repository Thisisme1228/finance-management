import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useState } from "react";
import { AccountValues, AccountSchema } from "@/lib/validation";

type Props = {
  id?: string;
  defaultValues?: AccountValues;
  onSubmit: (values: AccountValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  isPending?: boolean;
};

export const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  isPending,
}: Props) => {
  const [error, setError] = useState<string>();

  // 1. Define your form.
  const form = useForm<AccountValues>({
    resolver: zodResolver(AccountSchema),
    defaultValues,
  });

  // 2. Define a submit handler.
  const handleSubmit = (values: AccountValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g Cash, Bank, Credit Card"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? (
            "Save Changes"
          ) : !isPending ? (
            "Create Account"
          ) : (
            <Loader2 className="animate-spin" />
          )}
        </Button>

        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <Trash className="size-4 mr-2" />
            Delete account
          </Button>
        )}
      </form>
    </Form>
  );
};
