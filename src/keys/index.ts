import { Keys } from "../types";

const keys: Keys = {
  discordToken: process.env.DISCORD_TOKEN ?? undefined,
  gptapiKey: process.env.GPT_API_KEY ?? undefined 
}

if (Object.values(keys).includes(null))
  throw new Error('Missing keys from .env')

export default keys;