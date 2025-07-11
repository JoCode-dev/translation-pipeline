import dotenv from "dotenv";
import { run } from "./lib/cli";
import {
  executeCheckMissing,
  executeGenerateCache,
  executeReset,
  executeSync,
  translate,
} from "./scripts/translate";

import { logger } from "./utils/logger";
dotenv.config();

type DynamicEntry = {
  key: string;
  value: string;
  hash: string;
};

const main = async () => {
  try {
    const config = await run();

    // Rediriger vers la fonction appropriée selon la commande
    switch (config.command) {
      case "run":
        await translate(/* config */);
        break;
      case "check-missing":
        await executeCheckMissing(config);
        break;
      case "generate-cache":
        await executeGenerateCache(config);
        break;
      case "sync":
        await executeSync(config);
        break;
      case "reset":
        await executeReset(config);
        break;
      default:
        logger.error(`Commande inconnue: ${config.command}`);
        process.exit(1);
    }
  } catch (error) {
    await exit({ error });
  }
};

async function exit(reason: { error?: unknown; command?: string }) {
  console.log();
  logger.error("🚨 Erreur lors de l'exécution");
  console.log();

  if (reason.command) {
    logger.info(`La commande ${reason.command} a échoué.`);
  } else if (reason.error) {
    logger.error(`Erreur inattendue: ${reason.error}`);
  }

  console.log();
  process.exit(1);
}

main().catch(exit);
