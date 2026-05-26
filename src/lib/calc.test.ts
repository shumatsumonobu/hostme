import { describe, expect, it } from "vitest";
import { calculateDiagnosis, getTop3 } from "./calc";
import { parseAnswers, parseLang, parseRegion } from "./validate";

describe("calculateDiagnosis (global region)", () => {
  // ケース1: 商用OK・無料重視（商用OK・無料・簡単・従量NG・Next.js・個人・Cloudflare）
  it("ケース1: 商用OK・無料重視 → 1位 Cloudflare Workers", () => {
    const result = calculateDiagnosis([1, 0, 0, 0, 0, 0, 2], "ja", "global");
    const top3 = getTop3(result.rankings);

    expect(top3[0].service.id).toBe("cloudflare-workers");
    expect(top3[0].score).toBe(22); // 19 + 3(global)
    expect(top3[1].service.id).toBe("netlify");
    expect(top3[1].score).toBe(18); // 17 + 1(global)
  });

  // ケース2: Next.js初心者（非商用・無料・簡単・従量NG・Next.js・個人・なし）
  it("ケース2: Next.js初心者 → 1位 Vercel Hobby", () => {
    const result = calculateDiagnosis([0, 0, 0, 0, 0, 0, 3], "ja", "global");
    const top3 = getTop3(result.rankings);

    expect(top3[0].service.id).toBe("vercel-hobby");
    expect(top3[0].score).toBe(21); // 20 + 1(global)
    expect(top3[1].service.id).toBe("cloudflare-workers");
    expect(top3[1].score).toBe(20); // 17 + 3(global)
    expect(top3[2].service.id).toBe("netlify");
    expect(top3[2].score).toBe(19); // 18 + 1(global)
  });

  // ケース3: インフラ強者（商用OK・$5・Docker・気にしない・Vue・大規模・Google）
  it("ケース3: インフラ強者 → 1位 Cloud Run", () => {
    const result = calculateDiagnosis([1, 1, 2, 2, 1, 2, 1], "ja", "global");
    const top3 = getTop3(result.rankings);

    expect(top3[0].service.id).toBe("cloud-run");
    expect(top3[0].score).toBe(20); // 18 + 2(global)
  });
});

describe("calculateDiagnosis (asia region)", () => {
  it("ケース1 asia: Render がペナルティを受ける", () => {
    const result = calculateDiagnosis([1, 0, 0, 0, 0, 0, 2], "ja", "asia");
    const render = result.rankings.find((r) => r.service.id === "render")!;

    // global: render +0 → asia: render -1
    const resultGlobal = calculateDiagnosis([1, 0, 0, 0, 0, 0, 2], "ja", "global");
    const renderGlobal = resultGlobal.rankings.find((r) => r.service.id === "render")!;

    expect(render.score).toBe(renderGlobal.score - 1); // -1 vs 0
  });

  it("CF Workers はasiaでも強い", () => {
    const result = calculateDiagnosis([1, 0, 0, 0, 0, 0, 2], "ja", "asia");
    const top3 = getTop3(result.rankings);
    expect(top3[0].service.id).toBe("cloudflare-workers");
  });
});

describe("i18n: 英語版理由", () => {
  it("英語で理由テンプレートが使われる", () => {
    const result = calculateDiagnosis([1, 0, 0, 0, 0, 0, 2], "en", "global");
    const cf = result.rankings.find((r) => r.service.id === "cloudflare-workers")!;

    expect(cf.reasons.length).toBeGreaterThan(0);
    expect(cf.reasons).toContain("Commercial use OK on free plan");
  });

  it("英語のデフォルト理由が使われる", () => {
    const result = calculateDiagnosis([0, 0, 0, 0, 0, 0, 3], "en", "global");
    const render = result.rankings.find((r) => r.service.id === "render")!;
    expect(render.reasons).toEqual([
      "Simple PaaS with balanced support for various needs",
    ]);
  });
});

describe("getTop3 同点処理", () => {
  it("3位が同点なら4件以上返す", () => {
    const result = calculateDiagnosis([1, 0, 0, 0, 0, 0, 2]);
    const top3 = getTop3(result.rankings);
    const thirdScore = top3[2].score;

    const allWithThirdScore = result.rankings.filter((r) => r.score === thirdScore);
    const top3WithThirdScore = top3.filter((r) => r.score === thirdScore);
    expect(top3WithThirdScore.length).toBe(allWithThirdScore.length);
  });
});

describe("理由生成", () => {
  it("スコア3がある項目の理由テンプレートが使われる（日本語）", () => {
    const result = calculateDiagnosis([1, 0, 0, 0, 0, 0, 2], "ja", "global");
    const cf = result.rankings.find((r) => r.service.id === "cloudflare-workers")!;

    expect(cf.reasons.length).toBeGreaterThan(0);
    expect(cf.reasons).toContain("無料プランのまま商用利用OK");
  });

  it("スコア3がないサービスはデフォルト理由が使われる（日本語）", () => {
    const result = calculateDiagnosis([0, 0, 0, 0, 0, 0, 3], "ja", "global");
    const render = result.rankings.find((r) => r.service.id === "render")!;
    expect(render.reasons).toEqual([
      "幅広い条件にバランスよく対応するシンプルなPaaS",
    ]);
  });
});

describe("parseAnswers", () => {
  it("正常な入力をパースできる", () => {
    expect(parseAnswers("1,2,0,1,3,0,2")).toEqual([1, 2, 0, 1, 3, 0, 2]);
  });

  it("null を返す: null 入力", () => {
    expect(parseAnswers(null)).toBeNull();
  });

  it("null を返す: 空文字", () => {
    expect(parseAnswers("")).toBeNull();
  });

  it("null を返す: 桁数不足", () => {
    expect(parseAnswers("1,2,0")).toBeNull();
  });

  it("null を返す: 桁数超過", () => {
    expect(parseAnswers("1,2,0,1,3,0,2,1")).toBeNull();
  });

  it("null を返す: 範囲外の値（Q1は0-1のみ）", () => {
    expect(parseAnswers("2,0,0,0,0,0,0")).toBeNull();
  });

  it("null を返す: 負の値", () => {
    expect(parseAnswers("-1,0,0,0,0,0,0")).toBeNull();
  });

  it("null を返す: 小数", () => {
    expect(parseAnswers("0.5,0,0,0,0,0,0")).toBeNull();
  });

  it("null を返す: 文字列", () => {
    expect(parseAnswers("a,0,0,0,0,0,0")).toBeNull();
  });
});

describe("parseLang / parseRegion", () => {
  it("正常な lang をパースできる", () => {
    expect(parseLang("ja")).toBe("ja");
    expect(parseLang("en")).toBe("en");
  });

  it("不正な lang はデフォルト ja", () => {
    expect(parseLang(null)).toBe("ja");
    expect(parseLang("fr")).toBe("ja");
  });

  it("正常な region をパースできる", () => {
    expect(parseRegion("asia")).toBe("asia");
    expect(parseRegion("us")).toBe("us");
    expect(parseRegion("eu")).toBe("eu");
    expect(parseRegion("global")).toBe("global");
  });

  it("不正な region はデフォルト global", () => {
    expect(parseRegion(null)).toBe("global");
    expect(parseRegion("moon")).toBe("global");
  });
});
