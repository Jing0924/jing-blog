import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Link from "next/link";
import { getPost, getAllPosts } from "@/lib/posts";
import TagPill from "@/component/TagPill";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ date: p.date, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string; slug: string }>;
}): Promise<Metadata> {
  const { date, slug } = await params;
  const { data } = getPost(date, slug);
  return {
    title: data.title ? `${data.title} | Jing's Blog` : "Jing's Blog",
    description: data.description ?? "精煉後的正式文章與深度分析",
    openGraph: {
      title: data.title ?? slug,
      description: data.description ?? "",
      type: "article",
      publishedTime: data.date,
    },
  };
}

export const dynamicParams = false;

export default async function PostPage({
  params,
}: {
  params: Promise<{ date: string; slug: string }>;
}) {
  const { date, slug } = await params;
  const { data, content } = getPost(date, slug);

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/posts"
        className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 mb-8 inline-block transition-colors"
      >
        ← 返回文章
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
              <TagPill key={tag} tag={tag} href={`/posts?tag=${tag}`} />
            ))}
          </div>
        )}
      </div>
      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
