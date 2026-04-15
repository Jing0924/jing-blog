import { getPost, getAllPosts } from "@/lib/posts";
import PostArticle from "@/components/PostArticle";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ date: p.date, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string; slug: string }>;
}): Promise<Metadata> {
  const { date, slug } = await params;
  const { data } = getPost(date, slug);
  return {
    title: data.title ?? slug,
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
    <PostArticle
      data={data}
      content={content}
      slug={slug}
      backHref="/posts"
      backLabel="返回文章"
      tagHrefPrefix="/posts"
    />
  );
}
