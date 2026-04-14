import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import TagPill from "@/component/TagPill";

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
      <h1 className="text-3xl font-bold mb-2">文章</h1>
      <p className="text-zinc-500 mb-10">精煉後的正式文章與深度分析</p>
      <ul className="flex flex-col gap-6">
        {posts.map((post) => (
          <li key={`${post.date}-${post.slug}`}>
            <article className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
              <Link
                href={`/posts/${post.date}/${post.slug}`}
                className="group block"
              >
                <time className="text-sm text-zinc-400">{post.date}</time>
                <h2 className="text-xl font-semibold mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title ?? post.slug}
                </h2>
                {post.description && (
                  <p className="text-zinc-500 mt-2 text-sm">
                    {post.description}
                  </p>
                )}
              </Link>

              {post.tags && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {post.tags.map((t) => (
                    <TagPill
                      key={t}
                      tag={t}
                      href={tag === t ? "/posts" : `/posts?tag=${t}`}
                    />
                  ))}
                </div>
              )}
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
