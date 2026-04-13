import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Link from 'next/link'
import { getDraft, getAllDrafts } from '@/lib/posts'
import 'highlight.js/styles/github-dark.css'

export async function generateStaticParams() {
  const drafts = getAllDrafts()
  return drafts.map((d) => ({ date: d.date, slug: d.slug }))
}

export const dynamicParams = false

export default async function DraftPage({
  params,
}: {
  params: Promise<{ date: string; slug: string }>
}) {
  const { date, slug } = await params
  const { data, content } = getDraft(date, slug)

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/drafts" className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 mb-8 inline-block transition-colors">
        ← 返回學習日誌
      </Link>
      <div className="mb-10">
        <time className="text-sm text-zinc-400">{data.date}</time>
        <h1 className="text-3xl font-bold mt-2">{data.title ?? slug}</h1>
        {data.description && (
          <p className="text-zinc-500 mt-2">{data.description}</p>
        )}
        {data.tags && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {(data.tags as string[]).map((tag: string) => (
              <span key={tag} className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {content}
        </ReactMarkdown>
      </article>
    </main>
  )
}
