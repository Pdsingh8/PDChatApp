import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

export default function home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-[76vh]">
        <h1 className="text-2xl ml-[5rem] font-mono font-bold overflow-hidden whitespace-nowrap border-r-2 border-black animate-typewriter animate-blink">
          Welcome home
        </h1>

        <Link href="/chat">
          <p className="text-blue-300 font-bold hover:text-black mb-5 mt-5 dark:hover:text-white">
            ChatApp
          </p>
        </Link>

        <p className="text-gray-500;">want to logout?</p>
        <SignOutButton>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
