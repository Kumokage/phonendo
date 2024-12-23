import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import TitleBar from "./_components/TitleBar";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Phonendo UI",
  description: "MVP Phonendo UI",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="h-screen bg-gray-50">
        <TRPCReactProvider>
          <SessionProvider>
            <div className="flex h-full flex-col">
              <div className="basis-1/12">
                <TitleBar />
              </div>
              <div className="basis-11/12">{children}</div>
            </div>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
