import Link from "next/link";

export default function TagPill({ tag, href }: { tag: string; href: string }) {
  return (
    <Link
      href={href}
      className="text-xs border border-white/30 dark:border-white/10 bg-white/40 dark:bg-white/10 text-indigo-600 dark:text-indigo-300 px-3 py-0.5 rounded-full backdrop-blur-md ring-1 ring-inset ring-white/30 dark:ring-white/10 shadow-[0_2px_8px_0_rgba(31,38,135,0.15)] hover:bg-white/60 dark:hover:bg-white/20 hover:shadow-[0_4px_12px_0_rgba(31,38,135,0.25)] transition-all duration-300"
    >
      {tag}
    </Link>
  );
}
