import type { ChapterMeta, ChapterPart, ReportSection } from "./types";
import { publicUrl } from "@/lib/public-url";
import overview from "./chapters/overview.json";
import cyber1 from "./chapters/cyber-1.json";
import cyber2 from "./chapters/cyber-2.json";
import cyber3 from "./chapters/cyber-3.json";
import influence1 from "./chapters/influence-1.json";
import influence2 from "./chapters/influence-2.json";
import surveillance1 from "./chapters/surveillance-1.json";
import surveillance2 from "./chapters/surveillance-2.json";
import weapons from "./chapters/weapons.json";
import bio from "./chapters/bio.json";
import scams from "./chapters/scams.json";
import distillation from "./chapters/distillation.json";

const PARTS: Record<string, ChapterPart> = {
  overview: overview as ChapterPart,
  "cyber-1": cyber1 as ChapterPart,
  "cyber-2": cyber2 as ChapterPart,
  "cyber-3": cyber3 as ChapterPart,
  "influence-1": influence1 as ChapterPart,
  "influence-2": influence2 as ChapterPart,
  "surveillance-1": surveillance1 as ChapterPart,
  "surveillance-2": surveillance2 as ChapterPart,
  weapons: weapons as ChapterPart,
  bio: bio as ChapterPart,
  scams: scams as ChapterPart,
  distillation: distillation as ChapterPart,
};

export const CHAPTERS: ChapterMeta[] = [
  {
    id: "overview",
    title: "概述",
    enTitle: "Overview",
    kicker: "报告引言",
    pageStart: 3,
    pageEnd: 3,
    partIds: ["overview"],
    summary: "2025 年 12 月至 2026 年 8 月，Anthropic 在七个危害领域识别并阻断的恶意使用。",
  },
  {
    id: "cyber",
    title: "网络行动",
    enTitle: "Cyber operations",
    kicker: "从助手到编排器",
    pageStart: 4,
    pageEnd: 40,
    partIds: ["cyber-1", "cyber-2", "cyber-3"],
    summary: "国家支持团体、勒索团伙与个人如何把 Claude 变成杀伤链上的编排器。",
  },
  {
    id: "influence",
    title: "影响力行动",
    enTitle: "Influence operations",
    kicker: "宣传与不实信息",
    pageStart: 41,
    pageEnd: 80,
    partIds: ["influence-1", "influence-2"],
    summary: "国家宣传机构与商业网络用模型量产内容、账号与协同放大。",
  },
  {
    id: "surveillance",
    title: "监视行动",
    enTitle: "Surveillance operations",
    kicker: "针对异见者的系统",
    pageStart: 81,
    pageEnd: 110,
    partIds: ["surveillance-1", "surveillance-2"],
    summary: "商业间谍软件与安全机关把模型用于识别、画像和监控。",
  },
  {
    id: "weapons",
    title: "常规武器",
    enTitle: "Conventional weapons",
    kicker: "制导、无人与采购",
    pageStart: 111,
    pageEnd: 128,
    partIds: ["weapons"],
    summary: "行为者用 Claude 研发制导软件、无人机集群与规避出口管制的采购。",
  },
  {
    id: "bio",
    title: "生物滥用",
    enTitle: "Biological misuse",
    kicker: "两用研究的边界",
    pageStart: 129,
    pageEnd: 138,
    partIds: ["bio"],
    summary: "防护分类器如何限制高风险生物实验规划，以及仍在发生的试探。",
  },
  {
    id: "scams",
    title: "诈骗与欺诈",
    enTitle: "Scams and fraud",
    kicker: "GTG-15001",
    pageStart: 139,
    pageEnd: 142,
    partIds: ["scams"],
    summary: "二十余款假约会应用、四千七百个人设，两周内对话两万五千人。",
  },
  {
    id: "distillation",
    title: "非法蒸馏",
    enTitle: "Illicit distillation",
    kicker: "推理痕迹的收割",
    pageStart: 143,
    pageEnd: 154,
    partIds: ["distillation"],
    summary: "未授权实验室如何抽取 Claude 的思维链，以及随之而来的封禁与加固。",
  },
];

export const FIGURE_PAGES = new Set([
  1, 2, 7, 12, 15, 16, 17, 18, 19, 20, 21, 25, 27, 28, 31, 32, 33, 35, 40, 46,
  49, 50, 51, 52, 56, 57, 60, 61, 65, 66, 69, 73, 74, 77, 80, 84, 88, 91, 92,
  95, 96, 100, 114, 116, 118, 121, 122, 125, 128, 141, 143, 144, 154,
]);

export const PAGE_COUNT = 154;

export function originalPageSrc(page: number) {
  return publicUrl(`/pages/p${String(page).padStart(3, "0")}.jpg`);
}

export function figureSrc(page: number) {
  return publicUrl(`/figures/p${String(page).padStart(3, "0")}.jpg`);
}

export function chapterPageNumbers(pageStart: number, pageEnd: number) {
  const pages: number[] = [];
  for (let p = pageStart; p <= pageEnd; p++) pages.push(p);
  return pages;
}

export function getChapter(id: string): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function mergedChapter(id: string): {
  meta: ChapterMeta;
  lead?: string;
  sections: ReportSection[];
} | null {
  const meta = getChapter(id);
  if (!meta) return null;
  const parts = meta.partIds.map((pid) => PARTS[pid]).filter(Boolean);
  const sections = parts.flatMap((p) => p.sections);
  const lead = parts.find((p) => p.lead)?.lead;
  return { meta, lead, sections };
}

export type SearchHit = {
  chapterId: string;
  chapterTitle: string;
  sectionId: string;
  sectionTitle: string;
  snippet: string;
};

function blockText(block: ReportSection["blocks"][number]): string {
  switch (block.type) {
    case "p":
    case "note":
    case "quote":
    case "h2":
    case "h3":
      return block.zh;
    case "ul":
    case "ol":
      return block.items.join(" ");
    case "figure":
      return block.caption;
    case "ioc":
      return `${block.title ?? ""} ${block.items.join(" ")}`;
    case "table":
      return `${block.caption ?? ""} ${block.headers.join(" ")} ${block.rows.map((r) => r.join(" ")).join(" ")}`;
    default:
      return "";
  }
}

export function searchReport(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];
  const hits: SearchHit[] = [];
  for (const meta of CHAPTERS) {
    const merged = mergedChapter(meta.id);
    if (!merged) continue;
    for (const section of merged.sections) {
      const hay = `${section.title} ${section.blocks.map(blockText).join(" ")}`;
      const idx = hay.toLowerCase().indexOf(q);
      if (idx === -1) continue;
      const start = Math.max(0, idx - 36);
      const snippet = hay.slice(start, start + 120).replace(/\s+/g, " ").trim();
      hits.push({
        chapterId: meta.id,
        chapterTitle: meta.title,
        sectionId: section.id,
        sectionTitle: section.title,
        snippet,
      });
      if (hits.length >= 40) return hits;
    }
  }
  return hits;
}

export { PARTS };
