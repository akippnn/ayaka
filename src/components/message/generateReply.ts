import { EmbedBuilder } from "discord.js";
import config from "../../config.json";
import { ai as openai, db } from "../../services";
import { ActiveChannelRow } from "../../types";
import { retry, sendMessageInChunks } from "../../utils";
import { processMessages } from "./processMessages";
const { Collection, Message } = require("discord.js");

async function createChatCompletion(message: typeof Message, history: typeof Collection): Promise<any> {
  const maxRetries = config.settings.openai_err_retries;
  return await retry(maxRetries, async () => {
    await message.channel.sendTyping();
    return await openai
      .createChatCompletion({
        ...config.chatbot_args,
        user: message.author.id,
        messages: processMessages({
          client: message.client,
          prompt: message,
          history: history,
        }),
      });
  });
}

export default async function generateReply(
  message: typeof Message
): Promise<void> {
  const row = await new Promise<ActiveChannelRow>((resolve, reject) => {
    db.get(
      "SELECT channel_snowflake FROM active_channel WHERE guild_snowflake = ?",
      message.guild?.id,
      (err, row: ActiveChannelRow) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });

  if (!row) return;
  if (row.channel_snowflake !== message.channel.id) return;
  if (message.author.bot) return;
  if (message.content.startsWith("!")) return;

  console.log(message)

  try {
    let history = await message.channel.messages.fetch({
      limit: config.settings.history_messages_max,
    });
    history.reverse();
    const response = await createChatCompletion(message, history);
    await message.channel.sendTyping();
    if (!response.data) {
      await message.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `An error occured. Please try again.`
              )
              .setColor("#ff0000"),
          ],
      });
    }
    console.log(response.data.choices[0].message);
    let answer: string = response.data.choices[0].message.content.toString()
      .replace(
        new RegExp("^" + message.client.user.username + "[^•:]+[•:]"),
        ""
      );
    
    await sendMessageInChunks(answer, 2000, async (chunk) =>
      await message.channel.send(chunk)
    );
  } catch (error: unknown) {
    console.log(error);
  }
}
