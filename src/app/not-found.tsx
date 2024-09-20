import Link from "next/link";
import { Bird } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-screen h-screen  flex justify-center items-center">
      <div className="box-border pb-40">
        <Bird className="size-40" />
        <h2 className="text-center text-4xl">Not Found</h2>
        <Link
          href="/"
          className="block text-3xl text-center hover:underline text-blue-500"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
