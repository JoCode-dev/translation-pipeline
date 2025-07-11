import crypto from "crypto";

/**
 * Génère un hash SHA1 d'un texte donné
 */
export function hashText(text: string): string {
  return crypto.createHash("sha1").update(text, "utf8").digest("hex");
}

/**
 * Génère un hash SHA1 d'un objet JSON
 */
export function hashObject(obj: Record<string, any>): string {
  const jsonString = JSON.stringify(obj, Object.keys(obj).sort());
  return hashText(jsonString);
}

/**
 * Compare deux hash pour vérifier s'ils sont identiques
 */
export function compareHashes(hash1: string, hash2: string): boolean {
  return hash1 === hash2;
}

/**
 * Génère un hash court (8 caractères) pour un affichage simplifié
 */
export function shortHash(text: string): string {
  return hashText(text).substring(0, 8);
}

/**
 * Valide si une chaîne est un hash SHA1 valide
 */
export function isValidSHA1(hash: string): boolean {
  const sha1Regex = /^[a-f0-9]{40}$/i;
  return sha1Regex.test(hash);
}

/**
 * Génère un hash d'un fichier basé sur son contenu
 */
export function hashFileContent(content: string | Buffer): string {
  return crypto.createHash("sha1").update(content).digest("hex");
}
