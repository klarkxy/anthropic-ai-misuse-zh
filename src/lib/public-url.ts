/** Prefix a public asset path with Vite `base` (needed on GitHub Pages). */
export function publicUrl(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  const rel = path.replace(/^\/+/, "");
  return `${base}${rel}`;
}
