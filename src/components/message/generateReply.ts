// @ts-ignore
import config from "../../../config.json";
import { ai as openai, db } from "../../services";
import { Snowflake } from "discord.js";
import { processMessages } from "./processMessages";
import GPT3Tokenizer from "gpt3-tokenizer";
import { RequestArgs } from "openai/dist/base";
import { forEachChild } from "typescript";
const { Collection, Message } = require("discord.js");

interface active_channel {
  channel_snowflake: Snowflake;
}

async function generate(message: typeof Message, history: typeof Collection): Promise<any> {
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

  const tokenizer = new GPT3Tokenizer({ type: 'gpt3'});
  console.log(message)
  console.log(`Tokens used: ${tokenizer.encode(message.content).text.length}`)

  try {
    await message.channel.sendTyping(true);
    let history = await message.channel.messages.fetch({
      limit: config.settings.history_messages_max,
    });
    history.forEach((message: typeof Message) => {
      
    });
    history.reverse();
    const response = await generate(message, history);
    console.log(response.data.choices[0].message);
    let answer: string = response.data.choices[0].message.content.toString();
    console.log(`Tokens used: ${tokenizer.encode(answer).text.length}`)
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
