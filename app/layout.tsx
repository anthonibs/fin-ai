import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { TooltipProvider } from "./_components/ui/tooltip";

const mulish = Mulish({
  variable: "--font-mulish",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Finance IA",
  description: "Finance IA application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <body className={`${mulish.className} dark antialiased`}>
          <TooltipProvider delayDuration={200}>
            <div className="h-screen overflow-hidden">{children}</div>
          </TooltipProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
