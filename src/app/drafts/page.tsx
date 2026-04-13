import Link from 'next/link'
import { getAllDrafts } from '@/lib/posts'

export default function DraftsPage() {
  const drafts = getAllDrafts()

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">學習日誌</h1>
      <p className="text-zinc-500 mb-10">隨手記錄的學習筆記</p>
      <ul className="flex flex-col gap-6">
        {drafts.map((draft) => (
          <li key={`${draft.date}-${draft.slug}`}>
            <Link href={`/drafts/${draft.date}/${draft.slug}`} className="group block">
              <article className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
                <time className="text-sm text-zinc-400">{draft.date}</time>
                <h2 className="text-xl font-semibold mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {draft.title ?? draft.slug}
                </h2>
                {draft.description && (
                  <p className="text-zinc-500 mt-2 text-sm">{draft.description}</p>
                )}
                {draft.tags && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {draft.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
