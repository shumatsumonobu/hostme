import { questions } from "@/data/questions";
import type { Lang, Region } from "@/types";

const VALID_LANGS: Lang[] = ["ja", "en"];
const VALID_REGIONS: Region[] = ["asia", "us", "eu", "global"];

/**
 * URLの `l` パラメータを検証し、Lang を返す。不正な場合はデフォルト "ja"。
 */
export function parseLang(param: string | null): Lang {
  if (param && VALID_LANGS.includes(param as Lang)) return param as Lang;
  return "ja";
}

/**
 * URLの `r` パラメータを検証し、Region を返す。不正な場合はデフォルト "global"。
 */
export function parseRegion(param: string | null): Region {
  if (param && VALID_REGIONS.includes(param as Region)) return param as Region;
  return "global";
}

/**
 * URLの `a` パラメータ（例: "1,2,0,1,3,0,2"）を検証し、回答インデックス配列を返す。
 * 不正な場合は null を返す。
 */
export function parseAnswers(param: string | null): number[] | null {
  if (!param) return null;

  const parts = param.split(",");
  if (parts.length !== questions.length) return null;

  const answers: number[] = [];
  for (let i = 0; i < parts.length; i++) {
    const num = Number(parts[i]);
    if (!Number.isInteger(num) || num < 0 || num >= questions[i].options.length) {
      return null;
    }
    answers.push(num);
  }

  return answers;
}

/**
 * 回答インデックス配列を `a` パラメータ文字列に変換する。
 */
export function encodeAnswers(answers: number[]): string {
  return answers.join(",");
}
