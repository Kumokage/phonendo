import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import TitleBar from "./_components/TitleBar";

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
      <body>
        <TRPCReactProvider>
          <TitleBar />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
