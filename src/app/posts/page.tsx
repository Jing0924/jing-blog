import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文章",
  description: "精煉後的正式文章與深度分析",
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const allPosts = getAllPosts();
  const posts = tag ? allPosts.filter((p) => p.tags?.includes(tag)) : allPosts;

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">文章</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-10">精煉後的正式文章與深度分析</p>
      {tag && (
        <p className="text-sm text-zinc-400 mb-6">
          篩選標籤：<span className="text-indigo-600 dark:text-indigo-300 font-medium">{tag}</span>
        </p>
      )}
      <ul className="flex flex-col gap-6">
        {posts.map((post) => (
          <li key={`${post.date}-${post.slug}`}>
            <PostCard
              title={post.title}
              description={post.description}
              date={post.date}
              slug={post.slug}
              tags={post.tags}
              href={`/posts/${post.date}/${post.slug}`}
              activeTag={tag}
              tagHrefPrefix="/posts"
            />
          </li>
        ))}
      </ul>
      {posts.length === 0 && (
        <p className="text-zinc-400 dark:text-zinc-500 text-sm">沒有符合的文章。</p>
      )}
    </main>
  );
}
