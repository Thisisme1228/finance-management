"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";

export default function SearchField() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
  }

  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10 text-white" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-white" />
      </div>
    </form>
  );
}
