import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Caffe — Kafe & Restoran Yönetim Sistemi",
  description: "QR tabanlı sipariş, garson çağırma ve dijital sadakat kartı sistemi",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
