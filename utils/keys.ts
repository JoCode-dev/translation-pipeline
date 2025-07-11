import { SupportedFileType } from "../config/constants";

/**
 * Génère une clé de traduction basée sur le type de fichier et l'ID de l'élément
 */
export function generateTranslationKey(fileType: SupportedFileType, id: string | number): string {
  return `${fileType}.${id}`;
}

/**
 * Génère une clé de traduction pour un champ spécifique
 */
export function generateFieldKey(fileType: SupportedFileType, id: string | number, field: string): string {
  return `${fileType}.${id}.${field}`;
}

/**
 * Parse une clé de traduction pour extraire ses composants
 */
export function parseTranslationKey(key: string): {
  fileType: string;
  id: string;
  field?: string;
} {
  const parts = key.split(".");
  
  if (parts.length < 2) {
    throw new Error(`Clé de traduction invalide: ${key}`);
  }

  return {
    fileType: parts[0],
    id: parts[1],
    field: parts[2] || undefined
  };
}

/**
 * Valide si une clé de traduction est bien formée
 */
export function isValidTranslationKey(key: string): boolean {
  try {
    const parsed = parseTranslationKey(key);
    return parsed.fileType.length > 0 && parsed.id.length > 0;
  } catch {
    return false;
  }
}

/**
 * Normalise une clé de traduction
 */
export function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9.]/g, "_");
}

/**
 * Génère une clé unique pour un objet donné
 */
export function generateUniqueKey(obj: Record<string, any>, prefix: string = ""): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substr(2, 9);
  
  if (obj.id) {
    return `${prefix}${obj.id}_${timestamp}`;
  }
  
  if (obj.name) {
    const normalizedName = normalizeKey(obj.name);
    return `${prefix}${normalizedName}_${timestamp}`;
  }
  
  return `${prefix}${timestamp}_${randomSuffix}`;
}
