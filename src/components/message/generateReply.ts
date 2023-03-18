import config from "../../config.json";
import { ai as openai, db } from "../../services";
import { ActiveChannelRow } from "../../types";
import { processMessages } from "./processMessages";
import { Snowflake } from "discord.js";
const { Collection, Message } = require("discord.js");

async function createChatCompletion(message: typeof Message, history: typeof Collection): Promise<any> {
  return await openai
    .createChatCompletion({
      ...config.chatbot_args,
      user: message.author.id,
      messages: processMessages({
        client: message.client,
        prompt: message,
        history: history,
      }),
    })
    .catch((error: unknown) => {
      console.log(`OPENAI ERR: ${error}`);
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
    await message.channel.sendTyping(true);
    let history = await message.channel.messages.fetch({
      limit: config.settings.history_messages_max,
    });
    history.forEach((message: typeof Message) => {
      
    });
    history.reverse();
    const response = await createChatCompletion(message, history);
    console.log(response.data.choices[0].message);
    let answer: string = response.data.choices[0].message.content.toString();
    
    await message.channel.send(
      answer.replace(
        new RegExp("^" + message.client.user.username + "[^•:]+[•:]"),
        ""
      )
    );
  } catch (error: unknown) {
    await message.channel.sendTyping(false);
    console.log(error);
  }
}
