import fs from "fs";
import { logger } from "./logger";

export function readJsonFile(filePath: string): any {
  logger.info(`Reading file: ${filePath}`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContent);
}

export function writeJsonFile(filePath: string, data: any): void {
  logger.info(`Writing file: ${filePath}`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function deepSet(obj: any, path: string, value: any): void {
  logger.info(`Setting value: ${value} at path: ${path}`);
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

export function deepGet(obj: any, path: string): any {
  logger.info(`Getting value at path: ${path}`);
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!current[key]) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}
