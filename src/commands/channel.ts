import { db } from "../services";
import { ActiveChannelRow } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  Guild,
  GuildMember,
  TextChannel,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";

async function getActiveChannel(guild: Guild): Promise<string> {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT channel_snowflake FROM active_channel WHERE guild_snowflake = ?",
      [guild.id],
      (err: undefined, row: ActiveChannelRow | undefined) => {
        if (err) {
          reject(err);
        }
        if (row) {
          resolve(row.channel_snowflake);
        } else {
          resolve("");
        }
      }
    );
  });
}

async function setActiveChannel(guild: Guild, channel: TextChannel): Promise<void> {
  try {
    await db.run(
      "INSERT INTO active_channel (guild_snowflake, channel_snowflake) VALUES (?, ?) ON CONFLICT (guild_snowflake) DO UPDATE SET channel_snowflake = ?;",
      [guild.id, channel.id, channel.id]
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setactive")
    .setDescription("Set the current channel as active channel for this server")
    .addStringOption((option) =>
      option.setName("id").setDescription("The channel ID")
    ),

  async execute(interaction: CommandInteraction) {
    try {
      const guild = interaction.guild;
      const channel = interaction.channel as TextChannel;
      const member = interaction.member as GuildMember;

      if (!guild) {
        return await interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `You can only use this in a server!`
              )
              .setColor("#ff0000"),
          ],
        })
      }

      if (!member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return await interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `You need the \`MANAGE_CHANNELS\` permission to set the active channel.`
              )
              .setColor("#ff0000"),
          ],
        })
      }

      const hasManageChannels = channel
        .permissionsFor(interaction.client.user)
        ?.has(PermissionsBitField.Flags.ManageChannels);

      if (!hasManageChannels) {
        return await interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `I need the \`MANAGE_CHANNELS\` permission to set the active channel.`
              )
              .setColor("#ff0000"),
          ],
        });
      }

      setActiveChannel(guild, channel);

      await interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Successfully set active channel for guild ${guild.id} to channel ${channel.id}`
            )
            .setColor("#00ff00"),
        ],
      });
    } catch (error) {
      console.error(error);

      await interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "An error occurred while setting the active channel."
            )
            .setColor("#ff0000"),
        ],
      });
    }
  },
};
