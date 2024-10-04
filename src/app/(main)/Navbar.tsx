"use client";
import { Navigation } from "@/components/navigation";
// import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import { Filters } from "@/components/filters";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-10 shadow-sm bg-gradient-to-b from-green-700 to-green-500 px-4 py-8 lg:px-14 pb-36">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-3">
        <div className="flex items-center lg:gap-x-16">
          <Link href="/" className="text-2xl font-bold text-white pr-4">
            Finance
          </Link>
          <Navigation />
        </div>
        <div className="flex items-center lg:gap-x-16">
          {/* <SearchField /> */}
          <UserButton className="sm:ms-auto  pl-4" />
        </div>
      </div>
      {pathname === "/" && <Filters />}
    </header>
  );
}
