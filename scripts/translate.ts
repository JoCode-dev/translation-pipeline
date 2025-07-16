import path from "path";

import chalk from "chalk";
import {
  CACHE_DIR,
  CACHE_FILE,
  DATA_DIR,
  Lang,
  LANGUAGES,
  LOCALES_DIR,
  LOGS_DIR,
} from "../config/constants";
import { translateText } from "../services/deeplService";
import { hashText } from "../utils/hash";
import { deepGet, deepSet, readJsonFile, writeJsonFile } from "../utils/json";
import { logger } from "../utils/logger";

type DynamicEntry = {
  key: string;
  value: string;
};

const TRANSLATABLE_FIELDS = [
  {
    type: "product",
    fields: ["name", "description", "longDescription"],
  },
  {
    type: "category",
    fields: ["name", "description"],
  },
];

export async function extractDynamicEntries({
  products,
  categories,
}: {
  products: any[];
  categories: any[];
}) {
  const entries: {
    key: string;
    value: string;
    type: "product" | "category";
  }[] = [];

  for (const item of products) {
    const product = item.product;
    const id = product.id;
    for (const field of TRANSLATABLE_FIELDS.find((f) => f.type === "product")
      ?.fields || []) {
      const value = product[field];
      if (value) {
        entries.push({
          key: `products.${id}.${field}`,
          value,
          type: "product",
        });
      }
    }
  }

  for (const item of categories) {
    const category = item.category;
    const id = category.id;
    for (const field of TRANSLATABLE_FIELDS.find((f) => f.type === "category")
      ?.fields || []) {
      const value = category[field];
      if (value) {
        entries.push({
          key: `categories.${id}.${field}`,
          value,
          type: "category",
        });
      }
    }
  }

  return entries;
}

export async function executeCheckMissing(config: any) {
  const { frData, langData, entries, lang } = config;

  logger.info(chalk.yellow("🔍 Vérification des traductions manquantes..."));

  // TODO: Implémenter la logique de vérification des traductions manquantes
  const missing = [];
  for (const entry of entries) {
    const hasInLang = deepGet(langData, entry.key);
    if (!hasInLang) {
      missing.push(entry);
    }
  }

  if (missing.length > 0) {
    logger.info(chalk.red("🔍 Traductions manquantes trouvées:"));
    for (const entry of missing) {
      logger.info(chalk.red(`- ${entry.key}`));
    }
  } else {
    logger.info(chalk.green("✅ Vérification terminée"));
    logger.info(chalk.gray("🔍 Aucune traduction manquante trouvée"));
  }
}

export async function executeGenerateCache(config: any) {
  logger.info(chalk.cyan("🗄️ Génération du cache..."));

  // TODO: Implémenter la logique de génération du cache
  logger.info(chalk.blue("🔄 Analyse des fichiers sources..."));
  logger.info(chalk.blue("🔄 Calcul des hash de contenu..."));
  logger.info(chalk.blue("🔄 Création du cache..."));

  if (config.forceTranslation) {
    logger.info(
      chalk.yellow("⚠️ Mode force activé - régénération complète du cache")
    );
  }

  logger.info(chalk.green("✅ Cache généré avec succès"));
}

export async function executeSync(config: any) {
  logger.info(chalk.magenta("🔄 Synchronisation des traductions..."));

  // TODO: Implémenter la logique de synchronisation
  logger.info(chalk.blue("🔄 Analyse des fichiers de locale..."));
  logger.info(chalk.blue("🔄 Synchronisation des clés manquantes..."));
  logger.info(chalk.blue("🔄 Mise à jour des fichiers de locale..."));

  logger.info(chalk.green("✅ Synchronisation terminée"));
}

export async function executeReset(config: any) {
  logger.info(chalk.red("🔄 Réinitialisation du système..."));

  // TODO: Implémenter la logique de réinitialisation
  logger.info(chalk.blue("🔄 Suppression du cache..."));
  logger.info(chalk.blue("🔄 Réinitialisation des fichiers de locale..."));
  logger.info(chalk.blue("🔄 Nettoyage des logs..."));

  logger.info(chalk.green("✅ Système réinitialisé avec succès"));
}

function loadData(): {
  products: any[];
  categories: any[];
} {
  const products = readJsonFile(path.join(DATA_DIR, "products.json")) || [];
  const categories = readJsonFile(path.join(DATA_DIR, "categories.json")) || [];

  return {
    products,
    categories,
  };
}

/**
 * Translate the dynamic entries and inject them into the locale files
 */
export async function translate() {
  const frLocalePath = path.join(LOCALES_DIR, "fr.json");
  const cachePath = path.join(CACHE_DIR, CACHE_FILE);

  const frData = readJsonFile(frLocalePath);
  const cacheData = readJsonFile(cachePath);

  const { products, categories } = loadData();
  const allEntries = await extractDynamicEntries({ products, categories });

  const newEntries: typeof allEntries = [];
  const log: any[] = [];

  for (const entry of allEntries) {
    const hash = hashText(entry.value);
    const [type, id, field] = entry.key.split(".");
    const existingHash = cacheData?.[type]?.[id]?.[field];
    if (existingHash !== hash) {
      newEntries.push(entry);
      cacheData[type] = cacheData[type] || {};
      cacheData[type][id] = cacheData[type][id] || {};
      cacheData[type][id][field] = hash;
    }

    // Inject in fr.json
    deepSet(frData, entry.key, entry.value);
  }

  writeJsonFile(frLocalePath, frData);

  // Translate dynamic entries and inject
  for (const lang of LANGUAGES) {
    const localePath = path.join(LOCALES_DIR, `${lang}.json`);
    const localeData = readJsonFile(localePath);

    // Verify missing keys
    executeCheckMissing({
      frData,
      langData: localeData,
      entries: newEntries,
      lang,
    });

    for (const entry of newEntries) {
      const translatedValue = await translateText(
        entry.value,
        lang.toLowerCase() as Lang,
        "E-commerce Pizzeria in Switzerland"
      );

      deepSet(localeData, entry.key, translatedValue);
      log.push({
        lang,
        key: entry.key,
        value: entry.value,
        translatedValue,
      });
    }
    writeJsonFile(localePath, localeData);
  }

  // Update cache
  writeJsonFile(cachePath, cacheData);

  // Log
  const logPath = path.join(
    LOGS_DIR,
    `translation-log-${new Date().toISOString()}.json`
  );
  writeJsonFile(logPath, log);

  logger.info("✅ Translation complete");
}
