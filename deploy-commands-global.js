const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, ".env") });

const keys = {
  discordToken: process.env.BOT_TOKEN ?? "nil",
  clientId: process.env.BOT_CLIENT_ID ?? "nil",
  guildId: process.env.BOT_GUILD_ID ?? "nil",
};

if (Object.values(keys).includes("nil"))
  throw new Error(`One or more keys have a missing value.`);

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandsPath = path.join(__dirname, "dist", "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = require(`./dist/commands/${file}`);
  commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(keys.discordToken);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(keys.clientId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
