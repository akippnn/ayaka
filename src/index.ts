import keys from './keys'
import dotenv from 'dotenv';
import fs from "node:fs";
import path from "node:path";
import { Client, GatewayIntentBits } from "discord.js";
const db = require("./database");
const { Collection } = require("discord.js");

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file: string) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.login(keys.discordToken)
  .catch((err) => {
    console.error('[LOGIN ERROR]', err)
    process.exit(1)
  });