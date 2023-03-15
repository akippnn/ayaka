import { db } from "../services";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  GuildMember,
  TextChannel,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";

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
        return await interaction.reply(
          "This command can only be used in a guild channel."
        );
      }

      if (!member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return await interaction.reply(
          "You need the `MANAGE_CHANNELS` permission to set the active channel."
        );
      }

      if (!channel) {
        return await interaction.reply(
          "This command can only be used in a guild channel."
        );
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

      db.run(
        "INSERT OR REPLACE INTO active_channel (guild_snowflake, channel_snowflake) VALUES (?, ?)",
        [guild.id, channel.id],
        (err: undefined) => {
          if (err) {
            throw err;
          }
        }
      );

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
