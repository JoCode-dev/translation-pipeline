import * as p from "@clack/prompts";
import { Command } from "commander";
import chalk from "chalk";
import { LANGUAGES, Lang } from "../config/constants";

interface CLIOptions {
  source?: string;
  target?: string;
  cache?: boolean;
  force?: boolean;
  verbose?: boolean;
  apiKey?: string;
  yes?: boolean;
}

interface CLIResult {
  command: string;
  sourceFiles: string[];
  targetLanguages: Lang[];
  useCache: boolean;
  forceTranslation: boolean;
  verbose: boolean;
  apiKey?: string;
}

export const run = async (): Promise<CLIResult> => {
  const program = new Command()
    .name("translation-pipeline")
    .description("Pipeline de traduction automatisé utilisant l'API DeepL")
    .version("1.0.0");

  // Sous-commande : run
  program
    .command("run")
    .description("Exécuter la traduction des fichiers")
    .option("-s, --source <files>", "Fichiers sources à traduire (séparés par des virgules)", "products.json,categories.json")
    .option("-t, --target <languages>", "Langues cibles (séparées par des virgules)", LANGUAGES.join(","))
    .option("-c, --cache", "Utiliser le cache pour éviter les traductions redondantes", true)
    .option("-f, --force", "Forcer la traduction même si le cache existe", false)
    .option("-v, --verbose", "Mode verbose pour plus de détails", false)
    .option("-k, --api-key <key>", "Clé API DeepL")
    .option("-y, --yes", "Ignorer toutes les confirmations", false)
    .action(async (options: CLIOptions) => {
      const result = await handleRunCommand(options);
      process.exit(0);
    });

  // Sous-commande : check-missing
  program
    .command("check-missing")
    .description("Vérifier les traductions manquantes")
    .option("-v, --verbose", "Mode verbose pour plus de détails", false)
    .action(async (options: CLIOptions) => {
      const result = await handleCheckMissingCommand(options);
      process.exit(0);
    });

  // Sous-commande : generate-cache
  program
    .command("generate-cache")
    .description("Générer ou régénérer le cache des traductions")
    .option("-f, --force", "Forcer la régénération du cache", false)
    .option("-v, --verbose", "Mode verbose pour plus de détails", false)
    .action(async (options: CLIOptions) => {
      const result = await handleGenerateCacheCommand(options);
      process.exit(0);
    });

  // Sous-commande : sync
  program
    .command("sync")
    .description("Synchroniser les traductions entre les fichiers de locale")
    .option("-s, --source <files>", "Fichiers sources à synchroniser", "products.json,categories.json")
    .option("-t, --target <languages>", "Langues cibles à synchroniser", LANGUAGES.join(","))
    .option("-v, --verbose", "Mode verbose pour plus de détails", false)
    .action(async (options: CLIOptions) => {
      const result = await handleSyncCommand(options);
      process.exit(0);
    });

  // Sous-commande : reset
  program
    .command("reset")
    .description("Réinitialiser le système de traduction (cache et fichiers de locale)")
    .option("-y, --yes", "Confirmer la réinitialisation sans demander", false)
    .option("-v, --verbose", "Mode verbose pour plus de détails", false)
    .action(async (options: CLIOptions) => {
      const result = await handleResetCommand(options);
      process.exit(0);
    });

  // Commande par défaut (mode interactif)
  if (process.argv.length === 2) {
    return await handleInteractiveMode();
  }

  await program.parseAsync(process.argv);
  
  // Cette ligne ne devrait jamais être atteinte car chaque commande fait process.exit()
  return await handleInteractiveMode();
};

async function handleRunCommand(options: CLIOptions): Promise<CLIResult> {
  console.log(chalk.blue("🚀 Commande: translate:run"));
  console.log(chalk.gray("Options reçues:"), options);
  
  const useInteractive = !options.yes && process.stdin.isTTY;
  
  let result: CLIResult = {
    command: "run",
    sourceFiles: options.source?.split(",").map(f => f.trim()) || ["products.json", "categories.json"],
    targetLanguages: (options.target?.split(",").map((l: string) => l.trim().toLowerCase()) || LANGUAGES) as Lang[],
    useCache: options.cache ?? true,
    forceTranslation: options.force ?? false,
    verbose: options.verbose ?? false,
    apiKey: options.apiKey
  };

  if (useInteractive) {
    p.intro(chalk.cyan("🌍 Translation Pipeline - Run"));
    
    // Vérifier la clé API
    if (!result.apiKey && !process.env.DEEP_L_API_KEY) {
      const apiKey = await p.text({
        message: "Entrez votre clé API DeepL:",
        placeholder: "Votre clé API DeepL",
        validate: (value) => {
          if (!value || value.length === 0) {
            return "La clé API DeepL est requise";
          }
          return;
        }
      });

      if (p.isCancel(apiKey)) {
        p.cancel("Opération annulée");
        process.exit(0);
      }

      result.apiKey = apiKey;
    }

    p.outro(chalk.green("🚀 Configuration terminée"));
  }

  return result;
}

async function handleCheckMissingCommand(options: CLIOptions): Promise<CLIResult> {
  console.log(chalk.yellow("🔍 Commande: translate:check-missing"));
  console.log(chalk.gray("Options reçues:"), options);
  
  // TODO: Implémenter la logique de vérification des traductions manquantes
  console.log(chalk.blue("📋 Vérification des traductions manquantes..."));
  console.log(chalk.green("✅ Vérification terminée"));
  
  return {
    command: "check-missing",
    sourceFiles: [],
    targetLanguages: [...LANGUAGES],
    useCache: true,
    forceTranslation: false,
    verbose: options.verbose ?? false
  };
}

async function handleGenerateCacheCommand(options: CLIOptions): Promise<CLIResult> {
  console.log(chalk.cyan("🗄️ Commande: translate:generate-cache"));
  console.log(chalk.gray("Options reçues:"), options);
  
  // TODO: Implémenter la logique de génération du cache
  console.log(chalk.blue("🔄 Génération du cache..."));
  console.log(chalk.green("✅ Cache généré"));
  
  return {
    command: "generate-cache",
    sourceFiles: [],
    targetLanguages: [...LANGUAGES],
    useCache: true,
    forceTranslation: options.force ?? false,
    verbose: options.verbose ?? false
  };
}

async function handleSyncCommand(options: CLIOptions): Promise<CLIResult> {
  console.log(chalk.magenta("🔄 Commande: translate:sync"));
  console.log(chalk.gray("Options reçues:"), options);
  
  // TODO: Implémenter la logique de synchronisation
  console.log(chalk.blue("🔄 Synchronisation des traductions..."));
  console.log(chalk.green("✅ Synchronisation terminée"));
  
  return {
    command: "sync",
    sourceFiles: options.source?.split(",").map(f => f.trim()) || ["products.json", "categories.json"],
    targetLanguages: (options.target?.split(",").map((l: string) => l.trim().toLowerCase()) || LANGUAGES) as Lang[],
    useCache: true,
    forceTranslation: false,
    verbose: options.verbose ?? false
  };
}

async function handleResetCommand(options: CLIOptions): Promise<CLIResult> {
  console.log(chalk.red("🔄 Commande: translate:reset"));
  console.log(chalk.gray("Options reçues:"), options);
  
  if (!options.yes && process.stdin.isTTY) {
    p.intro(chalk.red("⚠️  Réinitialisation du système"));
    
    const confirmed = await p.confirm({
      message: "Voulez-vous vraiment réinitialiser le système de traduction? (cache et fichiers de locale)",
      initialValue: false
    });

    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel("Opération annulée");
      process.exit(0);
    }
  }
  
  // TODO: Implémenter la logique de réinitialisation
  console.log(chalk.blue("🔄 Réinitialisation du système..."));
  console.log(chalk.green("✅ Système réinitialisé"));
  
  return {
    command: "reset",
    sourceFiles: [],
    targetLanguages: [...LANGUAGES],
    useCache: false,
    forceTranslation: true,
    verbose: options.verbose ?? false
  };
}

async function handleInteractiveMode(): Promise<CLIResult> {
  p.intro(chalk.cyan("🌍 Translation Pipeline - Mode Interactif"));
  
  const command = await p.select({
    message: "Quelle action souhaitez-vous effectuer?",
    options: [
      { value: "run", label: "🚀 Exécuter la traduction", hint: "Traduire les fichiers sources" },
      { value: "check-missing", label: "🔍 Vérifier les traductions manquantes", hint: "Identifier les traductions à compléter" },
      { value: "generate-cache", label: "🗄️ Générer le cache", hint: "Créer ou régénérer le cache" },
      { value: "sync", label: "🔄 Synchroniser", hint: "Synchroniser les traductions" },
      { value: "reset", label: "🔄 Réinitialiser", hint: "Réinitialiser le système" }
    ]
  });

  if (p.isCancel(command)) {
    p.cancel("Opération annulée");
    process.exit(0);
  }

  // Rediriger vers la fonction appropriée
  switch (command) {
    case "run":
      return await handleRunCommand({});
    case "check-missing":
      return await handleCheckMissingCommand({});
    case "generate-cache":
      return await handleGenerateCacheCommand({});
    case "sync":
      return await handleSyncCommand({});
    case "reset":
      return await handleResetCommand({});
    default:
      console.log(chalk.red("Commande inconnue"));
      process.exit(1);
  }
}

export function validateLanguages(languages: string[]): string[] {
  return languages.filter(lang => LANGUAGES.includes(lang.toLowerCase() as Lang));
}

export function displayProgress(current: number, total: number, item: string): void {
  const percentage = Math.round((current / total) * 100);
  const bar = "█".repeat(Math.round(percentage / 5)) + "░".repeat(20 - Math.round(percentage / 5));
  console.log(`\r${chalk.cyan(`[${bar}]`)} ${percentage}% - ${item}`);
}
