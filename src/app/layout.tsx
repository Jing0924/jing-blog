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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jing-tech-blog.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jing's Tech Blog",
    template: "%s | Jing's Blog",
  },
  description: "記錄學習歷程與技術筆記",
  openGraph: {
    siteName: "Jing's Tech Blog",
    locale: "zh_TW",
    type: "website",
  },
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white/80 focus:text-zinc-900 focus:rounded-lg focus:shadow-lg focus:text-sm focus:backdrop-blur-md"
        >
          跳至主要內容
        </a>
        <header className="sticky top-0 z-10 border-b border-white/20 dark:border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] ring-1 ring-inset ring-white/30 dark:ring-white/10">
          <nav
            aria-label="主要導覽"
            className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between"
          >
            <Link href="/" className="font-semibold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Jing&apos;s Blog
            </Link>
            <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
              <Link
                href="/posts"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                文章
              </Link>
              <Link
                href="/drafts"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                學習日誌
              </Link>
              <a
                href="https://golden-queijadas-9fa6d6.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                個人網站
              </a>
            </div>
          </nav>
        </header>
        <div id="main-content" className="flex-1">{children}</div>
      </body>
    </html>
  );
}
