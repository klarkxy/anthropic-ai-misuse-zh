import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Download, FileText, List, Minus, Plus, Search, X } from "lucide-react";
import { CHAPTERS, chapterPageNumbers, originalPageSrc, searchReport, type SearchHit } from "@/lib/report/catalog";
import { publicUrl } from "@/lib/public-url";
import type { ReportSection } from "@/lib/report/types";
import { cn } from "@/lib/utils";

export function TopBar({
  onOpenToc,
  onOpenSearch,
  onOpenOriginal,
  fontScale,
  onFont,
  progress,
}: {
  onOpenToc: () => void;
  onOpenSearch: () => void;
  onOpenOriginal: () => void;
  fontScale: number;
  onFont: (next: number) => void;
  progress: number;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper/90 backdrop-blur-md">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-5">
        <button
          type="button"
          onClick={onOpenToc}
          className="inline-flex size-11 items-center justify-center rounded-md text-ink lg:hidden"
          aria-label="打开目录"
        >
          <List className="size-5" strokeWidth={1.75} />
        </button>
        <Link to="/" className="min-w-0 flex-1">
          <span className="block truncate font-display text-[0.95rem] font-medium tracking-tight text-ink">
            检测与应对 AI 滥用
          </span>
          <span className="hidden font-sans text-[0.68rem] tracking-[0.14em] text-muted sm:block">
            ANTHROPIC · 2026.09
          </span>
        </Link>
        <div className="flex items-center gap-1 rounded-md border border-rule bg-page px-1">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center text-muted hover:text-ink"
            aria-label="缩小字号"
            onClick={() => onFont(Math.max(0.875, +(fontScale - 0.0625).toFixed(4)))}
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-8 text-center font-mono text-[0.7rem] tabular-nums text-muted">
            {Math.round(fontScale * 100)}
          </span>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center text-muted hover:text-ink"
            aria-label="放大字号"
            onClick={() => onFont(Math.min(1.25, +(fontScale + 0.0625).toFixed(4)))}
          >
            <Plus className="size-3.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={onOpenOriginal}
          className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-ink hover:bg-chip"
          aria-label="对照原文"
        >
          <FileText className="size-4" strokeWidth={1.75} />
          <span className="hidden font-sans text-sm text-muted md:inline">
            原文
          </span>
        </button>
        <button
          type="button"
          onClick={onOpenSearch}
          className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-ink hover:bg-chip"
          aria-label="搜索"
        >
          <Search className="size-4" strokeWidth={1.75} />
          <span className="hidden font-sans text-sm text-muted md:inline">
            搜索
          </span>
        </button>
        <a
          href={publicUrl("/report-original.pdf")}
          download
          className="inline-flex size-11 items-center justify-center rounded-md text-ink hover:bg-chip"
          aria-label="下载英文原文 PDF"
        >
          <Download className="size-4" strokeWidth={1.75} />
        </a>
      </div>
      <div className="h-0.5 bg-rule" aria-hidden="true">
        <div
          className="h-full bg-accent transition-[width] duration-150"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </header>
  );
}

export function Sidebar({
  chapterId,
  sections,
  open,
  onClose,
}: {
  chapterId?: string;
  sections?: ReportSection[];
  open: boolean;
  onClose: () => void;
}) {
  const nav = (
    <nav className="flex flex-col gap-1 p-4">
      <p className="mb-3 px-2 font-sans text-[0.68rem] tracking-[0.2em] text-subtle">
        目录
      </p>
      <Link
        to="/"
        onClick={onClose}
        className="rounded-md px-3 py-2 font-sans text-sm text-muted hover:bg-chip hover:text-ink"
      >
        封面
      </Link>
      {CHAPTERS.map((ch) => {
        const active = ch.id === chapterId;
        return (
          <div key={ch.id}>
            <Link
              to="/c/$chapterId"
              params={{ chapterId: ch.id }}
              onClick={onClose}
              className={cn(
                "rounded-md px-3 py-2.5 transition-colors duration-150",
                active ? "bg-ink text-page" : "text-ink hover:bg-chip",
              )}
            >
              <span className="block font-sans text-[0.7rem] tracking-[0.14em] text-current/60">
                {String(ch.pageStart).padStart(3, "0")}–{ch.pageEnd}
              </span>
              <span className="block font-display text-[0.98rem] leading-snug">
                {ch.title}
              </span>
            </Link>
            {active && sections?.length ? (
              <ul className="mt-1 mb-2 ml-3 border-l border-rule pl-3">
                {sections
                  .filter((s) => s.title)
                  .map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={onClose}
                        className="block py-1.5 font-sans text-xs leading-snug text-muted hover:text-ink"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[17.5rem] shrink-0 overflow-y-auto border-r border-rule bg-sidebar lg:block">
        {nav}
      </aside>
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="关闭目录"
            onClick={onClose}
          />
          <div className="absolute inset-y-0 left-0 w-[min(20rem,88vw)] overflow-y-auto bg-paper shadow-xl">
            <div className="flex items-center justify-between border-b border-rule px-3 py-2">
              <span className="font-display text-sm">目录</span>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-11 items-center justify-center"
                aria-label="关闭"
              >
                <X className="size-5" />
              </button>
            </div>
            {nav}
          </div>
        </div>
      ) : null}
    </>
  );
}

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const hits = useMemo(() => (q.trim() ? searchReport(q) : []), [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  if (!open) return null;

  const go = (hit: SearchHit) => {
    onClose();
    void navigate({
      to: "/c/$chapterId",
      params: { chapterId: hit.chapterId },
      hash: hit.sectionId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/45 p-4 pt-[12vh]">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="关闭搜索"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-page shadow-[var(--shadow-border)]">
        <div className="flex items-center gap-2 border-b border-rule px-3">
          <Search className="size-4 text-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索译文…"
            className="h-12 w-full bg-transparent font-sans text-base text-ink outline-none placeholder:text-subtle"
          />
        </div>
        <ul className="max-h-[50vh] overflow-y-auto py-2">
          {q.trim() && hits.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-muted">无匹配</li>
          ) : null}
          {hits.map((hit, i) => (
            <li key={`${hit.chapterId}-${hit.sectionId}-${i}`}>
              <button
                type="button"
                onClick={() => go(hit)}
                className="flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left hover:bg-chip"
              >
                <span className="font-sans text-xs text-accent">
                  {hit.chapterTitle} · {hit.sectionTitle}
                </span>
                <span className="line-clamp-2 font-serif text-sm leading-relaxed text-ink">
                  {hit.snippet}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function OriginalPanel({
  title,
  pageStart,
  pageEnd,
  open,
  onClose,
}: {
  title: string;
  pageStart: number;
  pageEnd: number;
  open: boolean;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState<number | null>(null);
  const pages = chapterPageNumbers(pageStart, pageEnd);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoom != null) setZoom(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, zoom]);

  useEffect(() => {
    if (open) setZoom(null);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-rule px-3 sm:px-5">
        <p className="min-w-0 flex-1 truncate font-display text-sm">
          对照原文 · {title}
          <span className="ml-2 font-sans text-xs text-muted">
            p.{pageStart}–{pageEnd}
          </span>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-11 items-center justify-center rounded-md hover:bg-chip"
          aria-label="关闭原文"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-6 sm:px-8">
        <ol className="mx-auto flex max-w-3xl flex-col gap-6">
          {pages.map((page) => (
            <li key={page}>
              <button
                type="button"
                onClick={() => setZoom(page)}
                className="block w-full overflow-hidden rounded-lg bg-page shadow-[var(--shadow-border)]"
              >
                <img
                  src={originalPageSrc(page)}
                  alt={`原文第 ${page} 页`}
                  loading="lazy"
                  className="h-auto w-full"
                />
              </button>
              <p className="mt-2 text-center font-sans text-xs text-subtle">
                第 {page} 页
              </p>
            </li>
          ))}
        </ol>
      </div>
      {zoom != null ? (
        <div
          className="fixed inset-0 z-50 overflow-auto bg-ink/85 p-3"
          onClick={() => setZoom(null)}
          role="dialog"
          aria-modal="true"
        >
          <img
            src={originalPageSrc(zoom)}
            alt={`原文第 ${zoom} 页`}
            className="mx-auto max-w-5xl rounded-md shadow-2xl"
          />
        </div>
      ) : null}
    </div>
  );
}

export function ReaderDock({
  prevId,
  prevTitle,
  nextId,
  nextTitle,
  onToc,
  onSearch,
  onOriginal,
}: {
  prevId?: string;
  prevTitle?: string;
  nextId?: string;
  nextTitle?: string;
  onToc: () => void;
  onSearch: () => void;
  onOriginal: () => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <div className="grid h-14 grid-cols-5">
        {prevId ? (
          <Link
            to="/c/$chapterId"
            params={{ chapterId: prevId }}
            className="flex flex-col items-center justify-center text-ink"
            aria-label={`上一章 ${prevTitle ?? ""}`}
          >
            <ArrowLeft className="size-4" />
            <span className="mt-0.5 font-sans text-[0.65rem]">上一章</span>
          </Link>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onToc}
          className="flex flex-col items-center justify-center text-ink"
        >
          <List className="size-4" />
          <span className="mt-0.5 font-sans text-[0.65rem]">目录</span>
        </button>
        <button
          type="button"
          onClick={onOriginal}
          className="flex flex-col items-center justify-center text-ink"
        >
          <FileText className="size-4" />
          <span className="mt-0.5 font-sans text-[0.65rem]">原文</span>
        </button>
        <button
          type="button"
          onClick={onSearch}
          className="flex flex-col items-center justify-center text-ink"
        >
          <Search className="size-4" />
          <span className="mt-0.5 font-sans text-[0.65rem]">搜索</span>
        </button>
        {nextId ? (
          <Link
            to="/c/$chapterId"
            params={{ chapterId: nextId }}
            className="flex flex-col items-center justify-center text-ink"
            aria-label={`下一章 ${nextTitle ?? ""}`}
          >
            <ArrowRight className="size-4" />
            <span className="mt-0.5 font-sans text-[0.65rem]">下一章</span>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </nav>
  );
}
