// app/layout.tsx
import './globals.css';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import Navigation from './navigation/page';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Gemini Chat App',
  description: 'Chat with Gemini Chat App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navigation /> 
          <SignedIn>
            {children}
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  );
}
