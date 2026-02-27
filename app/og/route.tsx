import { ImageResponse } from "next/og";

import { SITE } from "../_seo/site";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams.get("title") || SITE.name;
  const title = rawTitle.slice(0, 80);

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        padding: 64,
        background: "#0a0a0a",
        color: "#f4f4f5",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            fontSize: 16,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#a1a1aa",
          }}
        >
          {SITE.url.replace(/^https?:\/\//, "")}
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "linear-gradient(135deg, #34d399, #fbbf24)",
            }}
          />
          <div style={{ fontSize: 22, fontWeight: 600 }}>{SITE.name}</div>
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#d4d4d8",
          }}
        >
          Tools & insights
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 500px at 20% 20%, rgba(16,185,129,0.20), transparent 60%), radial-gradient(900px 500px at 90% 70%, rgba(245,158,11,0.18), transparent 55%)",
          zIndex: -1,
        }}
      />
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
