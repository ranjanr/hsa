import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeaseLink - Housing & Rental Assistant",
  description: "Connecting tenants and landlords for stable housing in California. AI-powered notice interpreter, rent cap calculator, CA lease generator, and legal letter builder.",
  metadataBase: new URL("https://www.leaselink.app"),
  openGraph: {
    title: "LeaseLink - Housing & Rental Assistant",
    description: "Connecting tenants and landlords for stable housing in California.",
    url: "https://www.leaselink.app",
    siteName: "LeaseLink",
    images: [
      {
        url: "/og-image.jpg",
        width: 1000,
        height: 1000,
        alt: "LeaseLink Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeaseLink - Housing & Rental Assistant",
    description: "Connecting tenants and landlords for stable housing in California.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
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
