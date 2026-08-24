import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import { Providers } from "./providers";
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

export const viewport: Viewport = {
  themeColor: "#2F855A",
};

const themeInitScript = `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Providers>
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
