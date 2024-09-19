"use client";
import { useState, useTransition } from "react";
import LoadingButton from "@/components/loadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, LoginValues } from "@/lib/validation";
import { login } from "./actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const [error, setError] = useState<string>();
  //useTransition is a React Hook that lets you update the state without blocking the UI.
  const [isPending, startTransition] = useTransition();
  // 2. Define a submit handler.
  function onSubmit(values: LoginValues) {
    setError(undefined);

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    startTransition(async () => {
      const { error } = await login(values);
      if (error) setError(error);
    });
  }

  // 1. Define your form.
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={isPending} type="submit" className="w-full">
          Log in
        </LoadingButton>
      </form>
    </Form>
  );
}
