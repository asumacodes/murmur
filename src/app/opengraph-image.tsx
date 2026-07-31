import { ImageResponse } from "next/og";

export const alt = "Murmur - Speak. Transcribe. Ship.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const barHeights = [84, 156, 228, 300, 228, 156, 84];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#f5f1e8",
          padding: 72,
          fontFamily: "Georgia",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#c9a96e",
            fontSize: 32,
            fontStyle: "italic",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              width: 44,
              height: 44,
            }}
          >
            {barHeights.map((height, index) => (
              <div
                key={index}
                style={{
                  width: 4,
                  height: Math.round(height * 0.12),
                  borderRadius: 999,
                  background: "linear-gradient(180deg, #debc68 0%, #c9a44d 100%)",
                }}
              />
            ))}
          </div>
          <span>Murmur</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: 108, lineHeight: 0.95 }}>Speak.</div>
          <div style={{ fontSize: 108, lineHeight: 0.95, color: "#c9a96e" }}>
            Transcribe.
          </div>
          <div style={{ fontSize: 108, lineHeight: 0.95 }}>Ship.</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#a8a39a",
            fontSize: 28,
          }}
        >
          <span>A five-minute voice memo becomes a project foundation.</span>
          <span>v0.5</span>
        </div>
      </div>
    ),
    size,
  );
}
