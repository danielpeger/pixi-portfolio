import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Jua,
  Playfair_Display,
  Rubik,
} from "next/font/google";
import PersistentHome from "@/components/PersistentHome";
import ViewTransitions from "@/components/ViewTransitions";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jua",
});

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Daniel Péger",
  description: "My portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jua.variable} ${rubik.variable} ${playfair.variable}`}
      >
        <ViewTransitions>
          <PersistentHome>{children}</PersistentHome>
        </ViewTransitions>
      </body>
    </html>
  );
}
