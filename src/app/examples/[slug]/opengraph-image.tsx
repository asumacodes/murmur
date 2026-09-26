import { ImageResponse } from "next/og";
import { formatDuration, getRun, paletteOf, runs } from "@/content/runs";

export const alt = "A real Murmur run: PRD, brand kit and Jira board generated from a voice memo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return runs.map((r) => ({ slug: r.slug }));
}

function readable(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 150 ? "#141311" : "#ffffff";
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const run = getRun(slug) ?? runs[0];
  const bg = run.brand.colorPalette.secondary;
  const fg = readable(bg);
  const palette = paletteOf(run);
  const name = run.title.split(":")[0];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: bg, color: fg, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: 64 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, opacity: 0.8 }}>
            <span>Real Murmur run · {run.category}</span>
            <span>trymurmur.studio/examples</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, opacity: 0.75 }}>{run.idea}</span>
            <span style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>{name}</span>
            <span style={{ fontSize: 44, marginTop: 14, fontStyle: "italic" }}>“{run.brand.tagline}”</span>
          </div>
          <div style={{ display: "flex", gap: 36, fontSize: 26 }}>
            <span>{formatDuration(run.memoSeconds, "clock")} memo</span>
            <span>{formatDuration(run.runSeconds)} run</span>
            <span>{run.jira.epicCount} epics</span>
            <span>{run.jira.storyCount} stories</span>
          </div>
        </div>
        <div style={{ display: "flex", height: 28 }}>
          {palette.map((c) => (
            <div key={c.hex} style={{ flex: 1, background: c.hex }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
