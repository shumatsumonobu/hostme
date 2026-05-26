import { ImageResponse } from "next/og";
import { parseLang } from "@/lib/validate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = parseLang(searchParams.get("l"));
  const isJa = lang === "ja";

  // フォント読み込み（失敗してもデフォルトフォントで続行）
  let fontData: ArrayBuffer | undefined;
  try {
    const res = await fetch("https://fonts.gstatic.com/s/jetbrainsmono/v20/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff");
    if (res.ok) fontData = await res.arrayBuffer();
  } catch {
    // フォント取得失敗
  }

  const fonts = fontData
    ? [{ name: "JetBrains Mono", data: fontData, weight: 700 as const }]
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "48px 60px",
          width: "100%",
          height: "100%",
          backgroundColor: "#1a1a2e",
          color: "#00ff41",
          fontFamily: "JetBrains Mono",
        }}
      >
        {/* Terminal dots */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
          <span style={{ marginLeft: "8px", fontSize: "16px", color: "#00ff4180" }}>hostme</span>
        </div>

        <p style={{ fontSize: "24px", margin: "0", color: "#00ff4180" }}>
          $ hostme --help
        </p>

        <p style={{ fontSize: "48px", margin: "24px 0 0", fontWeight: 700, color: "#00ff41" }}>
          {isJa ? "30秒で、最適なホスティングが見つかる。" : "Find your ideal hosting in 30 seconds."}
        </p>

        <p style={{ fontSize: "28px", margin: "20px 0 0", color: "#00ff41cc" }}>
          {isJa
            ? "7つの質問 → 10サービス比較 → TOP3を提案"
            : "7 questions → compare 10 services → TOP 3 picks"}
        </p>

        <div style={{ display: "flex", gap: "16px", marginTop: "40px" }}>
          {["Vercel", "Cloudflare", "Netlify", "AWS", "Firebase"].map((name) => (
            <div
              key={name}
              style={{
                border: "1px solid #00ff4140",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "18px",
                color: "#00ff4180",
              }}
            >
              {name}
            </div>
          ))}
          <div
            style={{
              padding: "8px 16px",
              fontSize: "18px",
              color: "#00ff4140",
            }}
          >
            +5 more
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );
}
