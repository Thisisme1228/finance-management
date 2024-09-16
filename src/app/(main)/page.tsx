import Link from "next/link";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <p className="text-lg">
          This platform is designed to help you manage your finances. You can
          use it to track your expenses, set budgets, and more.
        </p>
        <Link
          href="/login"
          className="block text-3xl text-center hover:underline text-green-500"
        >
          login
        </Link>
      </div>
    </main>
  );
}
