"use client";

import Link from "next/link";
import ThemeSwitch from "../components/ThemeSwitch";
import { SignInButton } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
export default function Navigation() {
  return (
    <nav className="flex justify-between items-center p-10 bg-gray-800 text-white">
      <div className="text-lg font-bold">
        <Link
          href="/"
          className="hover:text-orange-300 transition duration-100 ease-in-out "
        >
          PdChat
        </Link>
      </div>
      <div className="space-x-20 flex justify-between">
        <ThemeSwitch />
        <SignInButton />
        <SignOutButton />
        <Link href="/" className="hover:text-blue-300">
          Home
        </Link>
        <UserButton />
      </div>
    </nav>
  );
}
