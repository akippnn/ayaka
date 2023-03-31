import { separator } from "../config.json";

export function lowerFirstChar(str: string) {
  return str.charAt(0).toLowerCase() + str.substr(1);
}

export function sanitize(str: string) {
  return str.replace(separator, "");
}

export async function sendMessageInChunks(message: string, maxChunkSize: number, callback: (chunk: string) => void): Promise<void> {
  const chunks = [];

  while (message.length > 0) {
    let chunk = message.substring(0, maxChunkSize);

    if (chunk.length === maxChunkSize) {
      let lastSpaceIndex = chunk.lastIndexOf(" ");

      if (lastSpaceIndex !== -1) {
        chunk = chunk.substring(0, lastSpaceIndex);
      }
    }

    chunks.push(chunk);
    message = message.substring(chunk.length);
  }

  for (const chunk of chunks) {
    callback(chunk);
  }
}