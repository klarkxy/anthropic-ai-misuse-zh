import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CHAPTERS, getChapter } from "@/lib/report/catalog";
import { loadPrefs } from "@/lib/report/progress";
import { publicUrl } from "@/lib/public-url";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [resumeId, setResumeId] = useState<string | undefined>();
  useEffect(() => {
    setResumeId(loadPrefs().lastChapter);
  }, []);
  const resume = resumeId ? getChapter(resumeId) : undefined;

  return (
    <main className="min-h-dvh bg-paper text-ink">
      <div className="mx-auto flex max-w-5xl flex-col px-5 pt-10 pb-20 sm:px-8 sm:pt-16">
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="font-sans text-[0.7rem] tracking-[0.28em] text-accent">
              ANTHROPIC THREAT INTELLIGENCE
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-[2.35rem] leading-[1.2] font-medium tracking-tight sm:text-5xl">
              检测与应对
              <br />
              人工智能滥用
            </h1>
            <p className="mt-3 font-display text-lg text-muted sm:text-xl">
              Detecting and countering misuse of AI
            </p>
            <p className="mt-2 font-sans text-sm tracking-[0.08em] text-subtle">
              2026 年 9 月 10 日发布 · 简体中文译本
            </p>
            <div className="mt-8 h-px w-20 bg-accent" />
            <p className="mt-8 max-w-2xl font-serif text-[1.05rem] leading-[1.9] text-ink/90">
              过去八个月，Anthropic
              威胁情报团队识别并阻断了威胁行为者试图利用 Claude
              从事恶意活动的行动。本阅读器提供该报告的简体中文全文，可检索、可调字号，并逐页对照英文原页。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/c/$chapterId"
                params={{ chapterId: resume?.id ?? "overview" }}
                className="inline-flex h-12 items-center gap-2 rounded-md bg-ink px-5 font-sans text-sm font-medium text-page transition-opacity hover:opacity-90"
              >
                {resume ? "继续阅读" : "开始阅读"}
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={publicUrl("/report-original.pdf")}
                download
                className="inline-flex h-12 items-center rounded-md border border-rule bg-page px-5 font-sans text-sm text-ink hover:bg-chip"
              >
                下载英文原文
              </a>
            </div>
            {resume ? (
              <p className="mt-3 font-sans text-xs text-muted">
                上次读到：{resume.title}
              </p>
            ) : null}
          </div>
          <figure className="hidden overflow-hidden rounded-xl border border-rule bg-page shadow-[var(--shadow-border)] lg:block">
            <img
              src={publicUrl("/pages/p002.jpg")}
              alt="报告目录"
              className="h-auto w-full"
            />
            <figcaption className="border-t border-rule px-4 py-2 font-sans text-xs text-muted">
              原文目录
            </figcaption>
          </figure>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["观测窗口", "2025.12–2026.08"],
            ["危害领域", "七类"],
            ["涉及模型", "Haiku / Sonnet / Opus"],
            ["原文篇幅", "154 页"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="rounded-lg border border-rule bg-page px-4 py-3"
            >
              <dt className="font-sans text-[0.68rem] tracking-[0.16em] text-subtle">
                {k}
              </dt>
              <dd className="mt-1 font-display text-sm text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        <ol className="mt-16 grid gap-3 sm:grid-cols-2">
          {CHAPTERS.map((ch, i) => (
            <li key={ch.id}>
              <Link
                to="/c/$chapterId"
                params={{ chapterId: ch.id }}
                className="group flex h-full flex-col rounded-xl bg-page p-5 shadow-[var(--shadow-border)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="font-mono text-[0.7rem] tabular-nums text-subtle">
                  {String(i + 1).padStart(2, "0")} · p.{ch.pageStart}–
                  {ch.pageEnd}
                </span>
                <span className="mt-2 font-display text-xl font-medium tracking-tight text-ink">
                  {ch.title}
                </span>
                <span className="mt-1 font-sans text-xs tracking-[0.12em] text-accent">
                  {ch.enTitle}
                </span>
                <span className="mt-3 flex-1 font-serif text-sm leading-relaxed text-muted">
                  {ch.summary}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 font-sans text-sm text-ink group-hover:text-accent">
                  阅读本章
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <p className="mt-16 max-w-2xl font-sans text-xs leading-relaxed text-subtle">
          原文由 Anthropic 于 2026 年 9 月 10
          日发布。本译本供阅读与研究，专有名称、失陷指标与恶意软件名保留原文。图表为报告原页。
        </p>
      </div>
    </main>
  );
}
