import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Link from "next/link";
import TagPill from "@/components/TagPill";

interface PostArticleProps {
  data: {
    title?: string;
    date?: string;
    description?: string;
    tags?: string[];
  };
  content: string;
  slug: string;
  backHref: string;
  backLabel: string;
  tagHrefPrefix: string;
}

export default function PostArticle({
  data,
  content,
  slug,
  backHref,
  backLabel,
  tagHrefPrefix,
}: PostArticleProps) {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href={backHref}
        className="text-sm text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-8 inline-flex items-center gap-1 transition-colors"
      >
        ← {backLabel}
      </Link>

      {/* Article header card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/30 dark:border-white/10 bg-white/40 dark:bg-white/5 p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-2xl mb-10 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
        {/* Inner glow ring */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30 dark:ring-white/10 pointer-events-none" />
        {/* Noise layer */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')] bg-repeat bg-[length:256px_256px]" />
        <div className="relative z-10">
          {data.date && (
            <time className="text-sm text-indigo-400 dark:text-indigo-400">{data.date}</time>
          )}
          <h1 className="text-3xl font-bold mt-2 text-zinc-900 dark:text-zinc-50">{data.title ?? slug}</h1>
          {data.description && (
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">{data.description}</p>
          )}
          {data.tags && data.tags.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {data.tags.map((tag) => (
                <TagPill key={tag} tag={tag} href={`${tagHrefPrefix}?tag=${tag}`} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Article body card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/30 dark:border-white/10 bg-white/40 dark:bg-white/5 px-8 py-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-2xl">
        {/* Inner glow ring */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30 dark:ring-white/10 pointer-events-none" />
        {/* Noise layer */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')] bg-repeat bg-[length:256px_256px]" />
        <article className="relative z-10 prose prose-zinc dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
