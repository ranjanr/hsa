import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeaseLink - Housing & Rental Assistant",
  description: "Bay Area Housing & Rental Stability Assistant for tenants and landlords",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
