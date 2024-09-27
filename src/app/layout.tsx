import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import Provider from "../util/Providers";
import { FirebaseNextJSProvider } from "firebase-nextjs/client/auth";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TaskManager",
  description: "Schedule tasks!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineProvider>
          <Notifications />
          <div className="bg-gray-100 text-black">
            <FirebaseNextJSProvider>
              <Provider>{children}</Provider>
            </FirebaseNextJSProvider>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
