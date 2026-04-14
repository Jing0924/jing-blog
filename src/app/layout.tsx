import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jing's Tech Blog",
  description: "記錄學習歷程與技術筆記",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-TW"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/0 backdrop-blur-sm">
          <nav className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg">
              Jing's Blog
            </Link>
            <div className="flex gap-6 text-sm text-zinc-500">
              <Link
                href="/posts"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                文章
              </Link>
              <Link
                href="/drafts"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                學習日誌
              </Link>
              <a
                href="https://golden-queijadas-9fa6d6.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                個人網站
              </a>
            </div>
          </nav>
        </header>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
