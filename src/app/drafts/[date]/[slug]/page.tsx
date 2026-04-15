import { getDraft, getAllDrafts } from "@/lib/posts";
import PostArticle from "@/components/PostArticle";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllDrafts().map((d) => ({ date: d.date, slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string; slug: string }>;
}): Promise<Metadata> {
  const { date, slug } = await params;
  const { data } = getDraft(date, slug);
  return {
    title: data.title ?? slug,
    description: data.description ?? "記錄學習歷程與技術筆記",
    openGraph: {
      title: data.title ?? slug,
      description: data.description ?? "",
      type: "article",
      publishedTime: data.date,
    },
  };
}

export const dynamicParams = false;

export default async function DraftPage({
  params,
}: {
  params: Promise<{ date: string; slug: string }>;
}) {
  const { date, slug } = await params;
  const { data, content } = getDraft(date, slug);

  return (
    <PostArticle
      data={data}
      content={content}
      slug={slug}
      backHref="/drafts"
      backLabel="返回學習日誌"
      tagHrefPrefix="/drafts"
    />
  );
}
