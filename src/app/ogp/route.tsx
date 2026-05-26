import { ImageResponse } from "next/og";
import { calculateDiagnosis, getTop3 } from "@/lib/calc";
import { parseAnswers, parseLang, parseRegion } from "@/lib/validate";
import type { Lang } from "@/types";

const containerStyle = {
  display: "flex" as const,
  flexDirection: "column" as const,
  padding: "48px 60px",
  width: "100%",
  height: "100%",
  backgroundColor: "#1a1a2e",
  color: "#00ff41",
  fontFamily: "JetBrains Mono",
};

function ogpOptions(fontData?: ArrayBuffer) {
  const opts: { width: number; height: number; fonts?: { name: string; data: ArrayBuffer; weight: 700 }[] } = {
    width: 1200,
    height: 630,
  };
  if (fontData) {
    opts.fonts = [{ name: "JetBrains Mono", data: fontData, weight: 700 }];
  }
  return opts;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const answers = parseAnswers(searchParams.get("a"));
    const lang = parseLang(searchParams.get("l"));
    const region = parseRegion(searchParams.get("r"));

    // フォント読み込み（失敗してもデフォルトフォントで続行）
    let fontData: ArrayBuffer | undefined;
    try {
      const res = await fetch("https://fonts.gstatic.com/s/jetbrainsmono/v20/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff");
      if (res.ok) fontData = await res.arrayBuffer();
    } catch {
      // フォント取得失敗 — デフォルトフォントで表示
    }

    if (!answers) {
      return new ImageResponse(
        <DefaultOgp lang={lang} />,
        ogpOptions(fontData)
      );
    }

    const result = calculateDiagnosis(answers, lang, region);
    const top3 = getTop3(result.rankings);
    const first = top3[0];
    const firstText = first.service.text[lang];

    return new ImageResponse(
      (
        <div style={containerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
            <span style={{ marginLeft: "8px", fontSize: "16px", color: "#00ff4180" }}>hostme</span>
          </div>

          <p style={{ fontSize: "24px", margin: "0", color: "#00ff4180" }}>
            $ hostme --region {region} analyze
          </p>

          <p style={{ fontSize: "32px", margin: "20px 0 0", color: "#00ff41" }}>
            ✔ Deploy target found!
          </p>

          <p style={{ fontSize: "48px", margin: "20px 0 0", fontWeight: 700, color: "#00ff41" }}>
            #1&nbsp; {first.service.name}
          </p>

          <p style={{ fontSize: "24px", margin: "12px 0 0", color: "#00ff41cc" }}>
            {firstText.annualCost} / {first.service.commercial
              ? (lang === "ja" ? "商用OK" : "Commercial OK")
              : (lang === "ja" ? "非商用" : "Non-commercial")}
          </p>

          <div style={{ display: "flex", gap: "40px", marginTop: "32px" }}>
            {top3.slice(1).map((r, i) => (
              <p key={r.service.id} style={{ fontSize: "22px", margin: "0", color: "#00ff4180" }}>
                #{i + 2}&nbsp; {r.service.name}
              </p>
            ))}
          </div>
        </div>
      ),
      ogpOptions(fontData)
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String(e), stack: (e as Error).stack }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function DefaultOgp({ lang }: { lang: Lang }) {
  const isJa = lang === "ja";
  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
        <span style={{ marginLeft: "8px", fontSize: "16px", color: "#00ff4180" }}>hostme</span>
      </div>

      <p style={{ fontSize: "24px", margin: "0", color: "#00ff4180" }}>
        $ hostme
      </p>

      <p style={{ fontSize: "40px", margin: "24px 0 0", fontWeight: 700, color: "#00ff41" }}>
        {isJa ? "hostme" : "hostme"}
      </p>

      <p style={{ fontSize: "28px", margin: "16px 0 0", color: "#00ff41cc" }}>
        {isJa
          ? "7つの質問で最適なホスティング先が見つかる"
          : "Find your ideal hosting in 7 questions"}
      </p>

      <p style={{ fontSize: "22px", margin: "12px 0 0", color: "#00ff4180" }}>
        {isJa ? "10サービスからTOP3を提案" : "TOP 3 from 10 services"}
      </p>
    </div>
  );
}
