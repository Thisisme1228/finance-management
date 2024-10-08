"use client";
import { useState, useTransition, useEffect } from "react";
import LoadingButton from "@/components/loadingButton";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  textMessageLoginSchema,
  TextMessageLoginValues,
  phoneRegex,
} from "@/lib/validation";
import { verifyLogin } from "./actions";
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
import kyInstance from "@/lib/ky";

export default function LoginForm() {
  // 1. Define your form.
  const form = useForm<TextMessageLoginValues>({
    resolver: zodResolver(textMessageLoginSchema),
    defaultValues: {
      phone: "",
      OTP: "",
    },
  });
  const [error, setError] = useState<string>();
  //useTransition is a React Hook that lets you update the state without blocking the UI.
  const [isPending, startTransition] = useTransition();
  const [timer, setTimer] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
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

  const handleSendCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(undefined);
    try {
      startTransition(async () => {
        const { error } = await kyInstance
          .post(`/api/auth/verification-code-login`, {
            json: { phone: phoneNumber },
          })
          .json<{ error: string }>();
        if (error) {
          setError(error);
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

  async function onSubmit(values: TextMessageLoginValues) {
    setError(undefined);
    try {
      startTransition(async () => {
        const response = await verifyLogin(values);
        console.log(response);
        if (response.error) {
          setError(response.error);
        }
      });
    } catch (error) {
      setError("Failed to login");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <p className="text-center text-destructive h-1">{error}</p>
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
                    onClick={handleSendCode}
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
        <LoadingButton loading={isPending} type="submit" className="w-full">
          Log in
        </LoadingButton>
      </form>
    </Form>
  );
}
