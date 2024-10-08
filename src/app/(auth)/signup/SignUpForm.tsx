"use client";

import LoadingButton from "@/components/loadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { signUpSchema, SignUpValues, phoneRegex } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { signup } from "./actions";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";

export default function SignUpForm() {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      phone: "",
      OTP: "",
      password: "",
    },
  });

  const [error, setError] = useState<string>();
  const [timer, setTimer] = useState<number>(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const [isPending, startTransition] = useTransition();

  const phoneNumber = form.watch("phone");

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsButtonDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    setIsPhoneValid(phoneRegex.test(phoneNumber));
  }, [phoneNumber]);

  const handleRequestVerificationCode = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setError(undefined);
    try {
      const phone = form.getValues("phone");
      startTransition(async () => {
        const { status } = await kyInstance
          .post(`/api/auth/send-verification-code`, {
            json: { phone },
          })
          .json<{ status: number }>();
        if (status !== 200) {
          setError("Failed to send SMS");
        } else {
          // Start the timer for 60 seconds
          setTimer(60);
          setIsButtonDisabled(true);
        }
      });
    } catch (error) {
      setError("Failed to send SMS");
    }
  };

  async function onSubmit(values: SignUpValues) {
    setError(undefined);
    const res = await signup(values);
    console.log(res);
    if (res?.error) setError(res.error);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Phone number"
                    type="tel"
                    maxLength={11}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant={
                      isButtonDisabled || !isPhoneValid ? "ghost" : "default"
                    }
                    disabled={isButtonDisabled || !isPhoneValid}
                    onClick={handleRequestVerificationCode}
                    className="absolute right-0 top-1/2 -translate-y-1/2 transform "
                  >
                    {isButtonDisabled ? `${timer}s` : "Send Code"}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="OTP"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your phone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
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
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={isPending} type="submit" className="w-full">
          Create account
        </LoadingButton>
      </form>
    </Form>
  );
}
