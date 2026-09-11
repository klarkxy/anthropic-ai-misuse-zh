const KEY = "ai-misuse-reader:v1";

export type ReaderPrefs = {
  fontScale: number;
  lastChapter?: string;
  lastSection?: string;
  scrollByChapter?: Record<string, number>;
};

const DEFAULTS: ReaderPrefs = { fontScale: 1 };

export function loadPrefs(): ReaderPrefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function savePrefs(patch: Partial<ReaderPrefs>) {
  const next = { ...loadPrefs(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clampFont(scale: number) {
  return Math.min(1.25, Math.max(0.875, +scale.toFixed(4)));
}
