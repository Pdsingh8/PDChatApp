import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";

import Navigation from "./navigation/page";
import { Providers } from "./providers";

export const metadata = {
  title: "Gemini Chat App",
  description: "Chat with Gemini Chat App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="dark:bg-slate-800">
          <Providers>
            <Navigation />
            <SignedIn>{children}</SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
