import { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Text Message Login",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl justify-center">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-2/3">
          <h1 className="text-center text-3xl font-bold">
            Login to finance management platform
          </h1>
          <div className="space-y-5">
            <LoginForm />
            <Link href="/login" className="block text-center hover:underline">
              phone number not working? Try using Username and password to login
            </Link>
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
