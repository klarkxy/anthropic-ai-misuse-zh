export type Block =
  | { type: "h2"; id: string; zh: string }
  | { type: "h3"; id: string; zh: string }
  | { type: "p"; zh: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "figure"; page: number; caption: string }
  | { type: "ioc"; title?: string; items: string[] }
  | {
      type: "table";
      caption?: string;
      headers: string[];
      rows: string[][];
    }
  | { type: "note"; zh: string }
  | { type: "quote"; zh: string };

export type ReportSection = {
  id: string;
  title: string;
  kicker?: string;
  blocks: Block[];
};

export type ChapterPart = {
  id: string;
  title: string;
  kicker?: string;
  pageStart: number;
  pageEnd: number;
  lead?: string;
  sections: ReportSection[];
};

export type ChapterMeta = {
  id: string;
  title: string;
  enTitle: string;
  kicker: string;
  pageStart: number;
  pageEnd: number;
  partIds: string[];
  summary: string;
};
