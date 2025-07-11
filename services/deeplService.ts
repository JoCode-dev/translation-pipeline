import { isResponseError } from "../lib/upfetch";
import { upfetch } from "../lib/upfetch";
import { Lang, SOURCE_LANG, DEFAULT_TARGET_LANG } from "../config/constants";

import dotenv from "dotenv";
dotenv.config();

const DEEP_L_API_KEY = process.env.DEEP_L_API_KEY;
const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

if (!DEEP_L_API_KEY) {
  throw new Error("DEEP_L_API_KEY is not set");
}

export async function translateText(
  text: string,
  lang: Lang = DEFAULT_TARGET_LANG,
  context?: string
): Promise<string> {
  const targetLang = lang.toUpperCase();

  try {
    const requestBody = {
      text: [text],
      target_lang: targetLang,
      ...(context && { context }),
      tag_handling: "html",
      source_lang: SOURCE_LANG,
    };

    const res = await upfetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `DeepL-Auth-Key ${DEEP_L_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();
    return data.translations[0].text;
  } catch (error) {
    console.error("Error translating text:", error);
    if (isResponseError(error)) {
      console.error("Error details:", error.data.message);
    }
    return text;
  }
}
