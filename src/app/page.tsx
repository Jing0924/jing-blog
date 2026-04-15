import Link from "next/link";
import { getAllDrafts, getAllPosts } from "@/lib/posts";

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 5);
  const recentDrafts = getAllDrafts().slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      {/* Hero */}
      <section className="mb-20">
        <div className="relative overflow-hidden rounded-2xl border border-white/30 dark:border-white/10 bg-white/40 dark:bg-white/5 p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-2xl transition-all duration-300 hover:bg-white/50 dark:hover:bg-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 dark:from-indigo-500/10 dark:via-purple-500/5 dark:to-pink-500/10 pointer-events-none" />
          {/* Inner glow ring */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30 dark:ring-white/10 pointer-events-none" />
          {/* Noise layer */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')] bg-repeat bg-[length:256px_256px]" />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
              Hi，我是 Jing 👋
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
              這裡記錄我的學習歷程、技術筆記與開發心得。
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com/Jing0924"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-4 py-2 rounded-full border border-white/30 dark:border-white/10 bg-white/30 dark:bg-white/5 text-indigo-600 dark:text-indigo-400 hover:bg-white/50 dark:hover:bg-white/10 backdrop-blur-md ring-1 ring-inset ring-white/20 transition-all duration-300"
              >
                GitHub →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 最新文章 */}
      {recentPosts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">最新文章</h2>
            <Link
              href="/posts"
              className="text-sm text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              查看全部 →
            </Link>
          </div>
          <ul className="flex flex-col gap-3">
            {recentPosts.map((post) => (
              <li key={`${post.date}-${post.slug}`}>
                <Link href={`/posts/${post.date}/${post.slug}`} className="group block rounded-xl border border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5 px-5 py-4 shadow-[0_4px_16px_0_rgba(31,38,135,0.15)] backdrop-blur-md hover:bg-white/50 dark:hover:bg-white/10 hover:shadow-[0_8px_24px_0_rgba(31,38,135,0.25)] ring-1 ring-inset ring-white/25 dark:ring-white/10 transition-all duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {post.title ?? post.slug}
                      </h3>
                      {post.description && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{post.description}</p>
                      )}
                    </div>
                    <time className="text-sm text-zinc-400 shrink-0">{post.date}</time>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 最新學習日誌 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">最新學習日誌</h2>
          <Link
            href="/drafts"
            className="text-sm text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            查看全部 →
          </Link>
        </div>
        <ul className="flex flex-col gap-3">
          {recentDrafts.map((draft) => (
            <li key={`${draft.date}-${draft.slug}`}>
              <Link href={`/drafts/${draft.date}/${draft.slug}`} className="group block rounded-xl border border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5 px-5 py-4 shadow-[0_4px_16px_0_rgba(31,38,135,0.15)] backdrop-blur-md hover:bg-white/50 dark:hover:bg-white/10 hover:shadow-[0_8px_24px_0_rgba(31,38,135,0.25)] ring-1 ring-inset ring-white/25 dark:ring-white/10 transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-zinc-800 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {draft.title ?? draft.slug}
                    </h3>
                    {draft.description && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{draft.description}</p>
                    )}
                  </div>
                  <time className="text-sm text-zinc-400 shrink-0">{draft.date}</time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
} 