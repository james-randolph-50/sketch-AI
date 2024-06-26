import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";
import { Navbar } from "./Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sketch AI",
  description: "AI Images from user sketches and prompts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navbar />
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}