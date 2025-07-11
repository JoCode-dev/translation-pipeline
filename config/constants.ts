export const LANGUAGES = ["en", "de", "it"] as const;
export type Lang = (typeof LANGUAGES)[number];

export const SOURCE_LANG = "fr";
export const DEFAULT_TARGET_LANG = "en";

export const CACHE_FILE = "translated-refs.json";
export const LOGS_FILE = "translation-log.json";

export const DATA_DIR = "data";
export const LOCALES_DIR = "locales";
export const LOGS_DIR = "logs";
export const CACHE_DIR = ".cache";

export const SUPPORTED_FILE_TYPES = ["products", "categories"] as const;
export type SupportedFileType = (typeof SUPPORTED_FILE_TYPES)[number];

export const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
export const DEEPL_RATE_LIMIT = 500000; // 500,000 caractères par mois pour la version gratuite
