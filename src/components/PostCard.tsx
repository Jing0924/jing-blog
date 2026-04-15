import Link from "next/link";
import TagPill from "@/components/TagPill";

interface PostCardProps {
  title?: string;
  description?: string;
  date: string;
  slug: string;
  tags?: string[];
  href: string;
  activeTag?: string;
  tagHrefPrefix: string;
}

export default function PostCard({
  title,
  description,
  date,
  slug,
  tags,
  href,
  activeTag,
  tagHrefPrefix,
}: PostCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/30 dark:border-white/10 bg-white/40 dark:bg-white/5 p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-2xl transition-all duration-300 hover:bg-white/50 dark:hover:bg-white/10 hover:shadow-[0_16px_48px_0_rgba(31,38,135,0.5)] hover:-translate-y-0.5">
      {/* Inner glow ring */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30 dark:ring-white/10 pointer-events-none" />
      {/* Noise layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')] bg-repeat bg-[length:256px_256px]" />
      <div className="relative z-10">
        <Link href={href} className="group block">
          <time className="text-sm text-indigo-400 dark:text-indigo-400">{date}</time>
          <h2 className="text-xl font-semibold mt-1 text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title ?? slug}
          </h2>
          {description && (
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">{description}</p>
          )}
        </Link>
        {tags && tags.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {tags.map((t) => (
              <TagPill
                key={t}
                tag={t}
                href={activeTag === t ? tagHrefPrefix : `${tagHrefPrefix}?tag=${t}`}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
