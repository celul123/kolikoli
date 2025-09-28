import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
})


export const metadata: Metadata = {
  title: "KoliKoli",
  description: "Depo yonetimi ve satis yazilimi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.className} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
