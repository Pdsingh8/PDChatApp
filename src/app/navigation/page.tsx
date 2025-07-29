import Link from "next/link";
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
      <div className="space-x-20">
        <SignInButton />
        <SignOutButton />
        <Link href="/" className="hover:text-blue-300">
          Home
        </Link>
        <UserButton />
        {/* <Link href="/chat" className="hover:text-blue-300">Chat</Link> */}

        {/* <Link href="/" className="hover:text-blue-300">Home</Link>
        <Link href="/chat" className="hover:text-blue-300">Chat</Link>
        <Link href="/sign-in" className="hover:text-blue-300">Sign In</Link>
        <Link href="/sign-up" className="hover:text-blue-300">Sign Up</Link> */}
      </div>
    </nav>
  );
}
