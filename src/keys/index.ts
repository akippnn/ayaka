import { Keys } from "../types";

const keys: Keys = {
  discordToken: process.env.DISCORD_TOKEN ?? 'nil',
  gptapiKey: process.env.GPT_API_KEY ?? 'nil',
};

if (Object.values(keys).includes('nil'))
  throw new Error(`One or more keys have a missing value.`);

export default keys;
