import { useEffect, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import type { Block, ReportSection } from "@/lib/report/types";
import { FIGURE_PAGES, figureSrc } from "@/lib/report/catalog";
import { cn } from "@/lib/utils";

function FigureBlock({ page, caption }: { page: number; caption: string }) {
  const [open, setOpen] = useState(false);
  const src = figureSrc(page);
  const available = FIGURE_PAGES.has(page);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!available) {
    return (
      <p className="my-6 border-l-2 border-accent/40 pl-4 text-sm text-muted">
        {caption}（原文第 {page} 页）
      </p>
    );
  }
  return (
    <figure className="my-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full overflow-hidden rounded-lg bg-chip shadow-[var(--shadow-border)] transition-transform duration-200 hover:scale-[1.01]"
      >
        <img
          src={src}
          alt={caption}
          className="h-auto w-full outline outline-1 -outline-offset-1 outline-ink/10"
        />
      </button>
      <figcaption className="mt-3 font-sans text-sm leading-relaxed text-muted">
        {caption}
        <span className="ml-2 text-subtle">原文第 {page} 页</span>
      </figcaption>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={caption}
        >
          <button
            type="button"
            className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-md bg-page/90 text-ink"
            aria-label="关闭"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" />
          </button>
          <img
            src={src}
            alt={caption}
            className="max-h-[90vh] max-w-full rounded-md shadow-2xl"
          />
        </div>
      ) : null}
    </figure>
  );
}

function IocBlock({ title, items }: { title?: string; items: string[] }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(items.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="my-6 overflow-hidden rounded-lg bg-ioc text-page">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2">
        <span className="font-sans text-xs tracking-[0.16em] text-page/70 uppercase">
          {title ?? "失陷指标"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-page/80 hover:bg-white/10 hover:text-page"
          aria-label="复制指标"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          <span className="font-sans text-xs">{copied ? "已复制" : "复制"}</span>
        </button>
      </div>
      <ul className="max-h-[28rem] overflow-auto px-4 py-3 font-mono text-[0.78rem] leading-7">
        {items.map((item) => (
          <li key={item} className="break-all">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={block.id}
          className="mt-12 mb-4 scroll-mt-28 font-display text-2xl font-medium tracking-tight text-ink"
        >
          {block.zh}
        </h2>
      );
    case "h3":
      return (
        <h3
          id={block.id}
          className="mt-9 mb-3 scroll-mt-28 font-display text-xl font-medium tracking-tight text-ink"
        >
          {block.zh}
        </h3>
      );
    case "p":
      return <p className="text-pretty leading-[1.9] text-ink">{block.zh}</p>;
    case "ul":
      return (
        <ul className="my-5 space-y-2.5 pl-5">
          {block.items.map((item, i) => (
            <li key={i} className="list-disc leading-[1.8] marker:text-accent">
              {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="my-5 space-y-2.5 pl-5">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="list-decimal leading-[1.8] marker:text-accent"
            >
              {item}
            </li>
          ))}
        </ol>
      );
    case "figure":
      return <FigureBlock page={block.page} caption={block.caption} />;
    case "ioc":
      return <IocBlock title={block.title} items={block.items} />;
    case "table":
      return (
        <div className="my-6 overflow-x-auto rounded-lg shadow-[var(--shadow-border)]">
          {block.caption ? (
            <div className="bg-chip px-3 py-2 font-sans text-sm text-muted">
              {block.caption}
            </div>
          ) : null}
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead className="bg-sidebar">
              <tr>
                {block.headers.map((h, i) => (
                  <th
                    key={`${h}-${i}`}
                    className="border-b border-rule px-3 py-2 font-medium text-ink"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="odd:bg-page even:bg-paper">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border-b border-rule/70 px-3 py-2 align-top leading-relaxed"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "note":
      return (
        <aside className="my-6 rounded-lg border border-rule bg-chip px-4 py-3 text-sm leading-relaxed text-ink">
          {block.zh}
        </aside>
      );
    case "quote":
      return (
        <blockquote className="my-6 border-l-2 border-accent pl-4 font-serif text-[1.02em] leading-relaxed text-ink/90 italic">
          {block.zh}
        </blockquote>
      );
    default:
      return null;
  }
}

export function Article({
  kicker,
  title,
  enTitle,
  lead,
  sections,
  fontScale,
}: {
  kicker?: string;
  title: string;
  enTitle?: string;
  lead?: string;
  sections: ReportSection[];
  fontScale: number;
}) {
  const toc = sections.filter((s) => s.title);
  return (
    <article
      className="article-body mx-auto w-full max-w-[44rem] px-5 py-10 sm:px-8 sm:py-14"
      style={{ fontSize: `${fontScale}rem` }}
    >
      {kicker ? (
        <p className="mb-3 font-sans text-xs font-medium tracking-[0.22em] text-accent">
          {kicker}
        </p>
      ) : null}
      <h1 className="font-display text-[2rem] leading-[1.25] font-medium tracking-tight text-ink sm:text-[2.4rem]">
        {title}
      </h1>
      {enTitle ? (
        <p className="mt-2 font-display text-base text-muted">{enTitle}</p>
      ) : null}
      <div className="mt-6 mb-10 h-px w-16 bg-accent" />
      {lead ? (
        <p className="mb-8 font-serif text-lg leading-[1.85] text-ink/90">
          {lead}
        </p>
      ) : null}
      {toc.length > 2 ? (
        <nav
          aria-label="本章目录"
          className="mb-10 rounded-lg border border-rule bg-page px-5 py-4"
        >
          <p className="mb-2 font-sans text-[0.68rem] tracking-[0.18em] text-subtle">
            本章目录
          </p>
          <ol className="space-y-1.5">
            {toc.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="font-sans text-sm text-ink hover:text-accent"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      {sections.map((section) => (
        <section key={section.id} className="mb-4">
          <h2
            id={section.id}
            className={cn(
              "scroll-mt-28 font-display font-medium tracking-tight text-ink",
              section.title
                ? "mt-14 mb-5 text-[1.55rem] leading-snug"
                : "sr-only",
            )}
          >
            {section.title}
          </h2>
          {section.kicker ? (
            <p className="mb-4 font-sans text-xs tracking-[0.18em] text-accent">
              {section.kicker}
            </p>
          ) : null}
          {section.blocks.map((block, i) => (
            <BlockView key={`${section.id}-${i}`} block={block} />
          ))}
        </section>
      ))}
    </article>
  );
}
