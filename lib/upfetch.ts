import { logger } from "../utils/logger";

export class ResponseError extends Error {
  constructor(
    message: string,
    public response: Response,
    public data: any
  ) {
    super(message);
    this.name = "ResponseError";
  }
}

export function isResponseError(error: unknown): error is ResponseError {
  return error instanceof ResponseError;
}

interface UpfetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export async function upfetch(
  url: string,
  options: UpfetchOptions = {}
): Promise<Response> {
  const {
    timeout = 30000,
    retries = 3,
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ResponseError(
          `HTTP ${response.status}: ${response.statusText}`,
          response,
          errorData
        );
      }

      return response;
    } catch (error) {
      if (attempt === retries) {
        logger.error(`Échec de la requête après ${retries + 1} tentatives`);
        throw error;
      }

      if (isResponseError(error)) {
        // Ne pas retry les erreurs 4xx (client errors)
        if (error.response.status >= 400 && error.response.status < 500) {
          throw error;
        }
      }

      logger.warn(`Tentative ${attempt + 1} échouée, retry dans ${retryDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw new Error("Toutes les tentatives ont échoué");
}
