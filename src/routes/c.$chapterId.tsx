import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Article } from "@/components/reader/Article";
import {
  OriginalPanel,
  ReaderDock,
  SearchModal,
  Sidebar,
  TopBar,
} from "@/components/reader/Chrome";
import { CHAPTERS, getChapter, mergedChapter } from "@/lib/report/catalog";
import { clampFont, loadPrefs, savePrefs } from "@/lib/report/progress";

function ChapterMissing() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-paper px-6 text-center text-ink">
      <p className="font-sans text-xs tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-3 font-display text-2xl">未找到该章节</h1>
      <Link
        to="/"
        className="mt-6 inline-flex h-11 items-center rounded-md bg-ink px-5 font-sans text-sm text-page"
      >
        返回封面
      </Link>
    </main>
  );
}

export const Route = createFileRoute("/c/$chapterId")({
  component: ChapterPage,
  notFoundComponent: ChapterMissing,
});

function ChapterPage() {
  const { chapterId } = Route.useParams();
  const data = mergedChapter(chapterId);
  const navigate = useNavigate();
  const [tocOpen, setTocOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [originalOpen, setOriginalOpen] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefs = loadPrefs();
    setFontScale(prefs.fontScale);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (typing) return;
      if (e.key === "/" ) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "o") setOriginalOpen((v) => !v);
      if (e.key === "[" || e.key === "]") {
        const i = CHAPTERS.findIndex((c) => c.id === chapterId);
        const target = e.key === "[" ? CHAPTERS[i - 1] : CHAPTERS[i + 1];
        if (target) {
          e.preventDefault();
          void navigate({
            to: "/c/$chapterId",
            params: { chapterId: target.id },
          });
        }
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setTocOpen(false);
        setOriginalOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chapterId, navigate]);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    onScroll();
    let t = 0;
    const persist = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const map = loadPrefs().scrollByChapter ?? {};
        savePrefs({
          lastChapter: chapterId,
          scrollByChapter: { ...map, [chapterId]: window.scrollY },
        });
      }, 280);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", persist, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", persist);
      window.clearTimeout(t);
    };
  }, [chapterId]);

  useEffect(() => {
    savePrefs({ lastChapter: chapterId });
    setOriginalOpen(false);
    const jump = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
        return;
      }
      const y = loadPrefs().scrollByChapter?.[chapterId];
      window.scrollTo({ top: y ?? 0 });
    };
    const t = window.setTimeout(jump, 80);
    window.addEventListener("hashchange", jump);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", jump);
    };
  }, [chapterId]);

  if (!data) throw notFound();

  const idx = CHAPTERS.findIndex((c) => c.id === chapterId);
  const prev = idx > 0 ? CHAPTERS[idx - 1] : undefined;
  const next =
    idx >= 0 && idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : undefined;
  const meta = getChapter(chapterId)!;

  const onFont = (nextScale: number) => {
    const scale = clampFont(nextScale);
    setFontScale(scale);
    savePrefs({ fontScale: scale });
  };

  return (
    <div className="min-h-dvh bg-paper">
      <TopBar
        onOpenToc={() => setTocOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenOriginal={() => setOriginalOpen(true)}
        fontScale={fontScale}
        onFont={onFont}
        progress={progress}
      />
      <div className="flex">
        <Sidebar
          chapterId={chapterId}
          sections={data.sections}
          open={tocOpen}
          onClose={() => setTocOpen(false)}
        />
        <div className="min-w-0 flex-1">
          <Article
            kicker={meta.kicker}
            title={meta.title}
            enTitle={meta.enTitle}
            lead={data.lead}
            sections={data.sections}
            fontScale={fontScale}
          />
          <nav className="mx-auto flex max-w-[44rem] flex-col gap-3 px-5 pb-28 sm:flex-row sm:px-8 lg:pb-20">
            {prev ? (
              <Link
                to="/c/$chapterId"
                params={{ chapterId: prev.id }}
                className="flex flex-1 items-center gap-3 rounded-lg border border-rule bg-page px-4 py-3 hover:bg-chip"
              >
                <ArrowLeft className="size-4 shrink-0" />
                <span>
                  <span className="block font-sans text-xs text-muted">
                    上一章
                  </span>
                  <span className="font-display">{prev.title}</span>
                </span>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
            {next ? (
              <Link
                to="/c/$chapterId"
                params={{ chapterId: next.id }}
                className="flex flex-1 items-center justify-end gap-3 rounded-lg border border-rule bg-page px-4 py-3 text-right hover:bg-chip"
              >
                <span>
                  <span className="block font-sans text-xs text-muted">
                    下一章
                  </span>
                  <span className="font-display">{next.title}</span>
                </span>
                <ArrowRight className="size-4 shrink-0" />
              </Link>
            ) : null}
          </nav>
        </div>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <OriginalPanel
        title={meta.title}
        pageStart={meta.pageStart}
        pageEnd={meta.pageEnd}
        open={originalOpen}
        onClose={() => setOriginalOpen(false)}
      />
      <ReaderDock
        prevId={prev?.id}
        prevTitle={prev?.title}
        nextId={next?.id}
        nextTitle={next?.title}
        onToc={() => setTocOpen(true)}
        onSearch={() => setSearchOpen(true)}
        onOriginal={() => setOriginalOpen(true)}
      />
    </div>
  );
}
