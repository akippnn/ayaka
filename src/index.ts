import { ai as openai, client, db } from "./services";
import dotenv from "dotenv";
import path from "node:path";
import keys from "./keys"
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

client.login(keys.discordToken).catch((err) => {
  console.error("[error]", err);
  process.exit(1);
});