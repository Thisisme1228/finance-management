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
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { CategoriesValues, CategoriesSchema } from "@/lib/validation";

type Props = {
  id?: string;
  defaultValues?: CategoriesValues;
  onSubmit: (values: CategoriesValues, id?: string) => void;
  onDelete?: () => void;
  disabled?: boolean;
  isPending?: boolean;
  buttonText?: string;
};

export const CategoryForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  isPending,
  buttonText,
}: Props) => {
  const [error, setError] = useState<string>();

  // 1. Define your form.
  const form = useForm<CategoriesValues>({
    resolver: zodResolver(CategoriesSchema),
    defaultValues,
  });

  // 2. Define a submit handler.
  const handleSubmit = (values: CategoriesValues) => {
    onSubmit(values, id);
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
                  placeholder="e.g Social, Clothing, Education"
                  {...field}
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
