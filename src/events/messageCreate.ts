import { ai as openai } from "../services";
import { processMessages } from "../components";
const client = require("../client")
const db = require("../database");
const config = require("../config.json")
const { Events, Message } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  async execute(message: typeof Message) {
    const activeChannel = await db.get(
      "SELECT channel_snowflake FROM active_channel WHERE guild_snowflake = ?",
      message.guild?.id
    );
    if (activeChannel && activeChannel.channel_snowflake !== message.channel.id)
      return;
    if (message.author.bot) return;
    if (message.content.startsWith("!")) return;

    try {
      await message.channel.sendTyping();
      let prevMsgs = await message.channel.messages.fetch({
        limit: config.chatbot.history_length,
      });
      prevMsgs.reverse();
      const response = await openai
        .createChatCompletion({
          ...config.chatbot_args,
          model: "gpt-3.5-turbo",
          messages: processMessages({
            client: client,
            prompt: message,
            history: prevMsgs,
          }),
        })
        .catch((error: unknown) => {
          console.log(`OPENAI ERR: ${error}`);
        });

      console.log(response.data.choices[0].message);
      let answer = response.data.choices[0].message.content.toString();
      await message.channel.send(
        answer.replace(
          new RegExp("^" + client.user.username + "[^•:]+[•:] "),
          ""
        )
      );
    } catch (error: unknown) {
      console.log(error);
    }
  },
};

export {};
