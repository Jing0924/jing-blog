import Link from "next/link";
import { getAllDrafts } from "@/lib/posts";


export default function Home() {
  const recentDrafts = getAllDrafts().slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      {/* Hero */}
      <section className="mb-20">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Hi，我是 Jing 👋
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
          這裡記錄我的學習歷程、技術筆記與開發心得。
        </p>
        <div className="flex gap-4 mt-6">
          <a
            href="https://github.com/你的帳號"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            GitHub →
          </a>
        </div>
      </section>

      {/* 最新學習日誌 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">最新學習日誌</h2>
          <Link
            href="/drafts"
            className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            查看全部 →
          </Link>
        </div>
        <ul className="flex flex-col gap-4">
          {recentDrafts.map((draft) => (
            <li key={`${draft.date}-${draft.slug}`}>
              <Link href={`/drafts/${draft.date}/${draft.slug}`} className="group block">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {draft.title ?? draft.slug}
                    </h3>
                    {draft.description && (
                      <p className="text-sm text-zinc-500 mt-1">{draft.description}</p>
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