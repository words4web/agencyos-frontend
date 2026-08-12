import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { FcmProvider } from "@/providers/FcmProvider";
import { Toaster } from "sonner";
import { GlobalNotificationBanner } from "@/components/notification/GlobalNotificationBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgencyOS",
  description:
    "Digital headquarters for client and project workflow management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        <ReduxProvider>
          <QueryProvider>
            <FcmProvider>
              <GlobalNotificationBanner />
              {children}
              <Toaster theme="dark" position="top-right" richColors />
            </FcmProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
