import config from "../config.json"
import { processMessages } from "../components";
import { ai as openai } from "../services";
// import { db } from "../services"
import sqlite3 from "sqlite3";
const { Events, Message } = require("discord.js");
type Snowflake = string;

const db = new sqlite3.Database(
  "ayaka.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
);

//function dbget(stmt: String, i: Array<any>, cb: (row: any) => void) {
  //db.get("SELECT channel_snowflake FROM active_channel WHERE guild_snowflake = ?", i, )
//}

module.exports = {
  name: Events.MessageCreate,
  async execute(message: typeof Message): Promise<void> {
    db.get("SELECT channel_snowflake FROM active_channel WHERE guild_snowflake = ?", message.guild?.id, (err, row: Snowflake) => 
      {
        if (err) {
          console.log(err)
        }
        else {
          if (row !== message.channel.id)
          return;
        }
      }
    );

    if (message.author.bot) return;
    if (message.content.startsWith("!")) return;

    try {
      await message.channel.sendTyping();
      let prevMsgs = await message.channel.messages.fetch({
        limit: config.settings.history_messages_max,
      });
      prevMsgs.reverse();
      const response = await openai
        .createChatCompletion({
          ...config.chatbot_args,
          model: "gpt-3.5-turbo",
          messages: processMessages({
            client: message.client,
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
          new RegExp("^" + message.client.user.username + "[^•:]+[•:] "),
          ""
        )
      );
    } catch (error: unknown) {
      console.log(error);
    }
  },
};
