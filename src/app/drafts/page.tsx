import { getAllDrafts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "學習日誌",
  description: "隨手記錄的學習筆記",
};

export default async function DraftsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const allDrafts = getAllDrafts();
  const drafts = tag
    ? allDrafts.filter((d) => d.tags?.includes(tag))
    : allDrafts;

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">學習日誌</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-10">隨手記錄的學習筆記</p>
      {tag && (
        <p className="text-sm text-zinc-400 mb-6">
          篩選標籤：<span className="text-purple-600 dark:text-purple-300 font-medium">{tag}</span>
        </p>
      )}
      <ul className="flex flex-col gap-6">
        {drafts.map((draft) => (
          <li key={`${draft.date}-${draft.slug}`}>
            <PostCard
              title={draft.title}
              description={draft.description}
              date={draft.date}
              slug={draft.slug}
              tags={draft.tags}
              href={`/drafts/${draft.date}/${draft.slug}`}
              activeTag={tag}
              tagHrefPrefix="/drafts"
            />
          </li>
        ))}
      </ul>
      {drafts.length === 0 && (
        <p className="text-zinc-400 dark:text-zinc-500 text-sm">沒有符合的日誌。</p>
      )}
    </main>
  );
}
