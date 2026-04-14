import Link from "next/link";

export default function TagPill({ tag, href }: { tag: string; href: string }) {
  return (
    <Link
      href={href}
      className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full"
    >
      {tag}
    </Link>
  );
}
