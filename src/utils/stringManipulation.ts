import { separator } from "../config.json";

export function lowerFirstChar(str: string) {
  return str.charAt(0).toLowerCase() + str.substr(1);
}

export function sanitize(str: string) {
  return str.replace(separator, "");
}
