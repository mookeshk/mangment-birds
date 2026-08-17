import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  weight: ['400', '500', '700', '800'],
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "نظام إدارة مزرعة الطيور | Bird Farm Management",
  description: "نظام متكامل لإدارة مزارع الطيور والإنتاج",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#2F855A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
