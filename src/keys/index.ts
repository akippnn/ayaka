import dotenv from "dotenv";
import path from "node:path";
import { Keys } from "../types";
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });

const keys: Keys = {
  discordToken: process.env.BOT_TOKEN ?? "nil",
  gptApiKey: process.env.GPT_API_KEY ?? "nil",
};

if (Object.values(keys).includes("nil"))
  throw new Error(`One or more keys have a missing value.`);

export default keys;
