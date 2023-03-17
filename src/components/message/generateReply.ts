import config from "../../config.json";
import { ai as openai, db } from "../../services";
import { Snowflake } from "discord.js";
import { processMessages } from "./processMessages";
const { Message } = require("discord.js");

interface active_channel {
  channel_snowflake: Snowflake;
}

export default async function generateReply(
  message: typeof Message
): Promise<void> {
  const row = await new Promise<active_channel>((resolve, reject) => {
    db.get(
      "SELECT channel_snowflake FROM active_channel WHERE guild_snowflake = ?",
      message.guild?.id,
      (err, row: active_channel) => {
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

  try {
    let history = await message.channel.messages.fetch({
      limit: config.settings.history_messages_max,
    });
    history.reverse();
    await message.channel.sendTyping();
    const response = await openai
      .createChatCompletion({
        ...config.chatbot_args,
        model: "gpt-3.5-turbo",
        stop: ["<|endoftext|>"],
        messages: processMessages({
          client: message.client,
          prompt: message,
          history: history,
        }),
      })
      .catch((error: unknown) => {
        console.log(`OPENAI ERR: ${error}`);
      });

    console.log(response.data.choices[0].message);
    let answer = response.data.choices[0].message.content.toString();
    await message.channel.send(
      answer.replace(
        new RegExp("^" + message.client.user.username + "[^•:]+[•:]"),
        ""
      )
    );
  } catch (error: unknown) {
    console.log(error);
  }
}
