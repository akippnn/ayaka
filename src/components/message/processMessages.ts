import { ChatCompletionResponseMessage } from "openai";
import config from "../../config.json";
import { Config } from "../../types/config";
import { getCurrentTime, sanitize } from "../../utils";
const { Message } = require("discord.js");

function chatHeader(msg: typeof Message, prevAuthor?: string | undefined) {
  return !msg.author.bot && prevAuthor === msg.author.id
    ? ""
    : `user ${msg.author.tag} time ${getCurrentTime(msg.createdAt)}`;
}

export function processMessages({
  client,
  prompt,
  history,
}: ProcMsgArgs): Array<ChatCompletionResponseMessage> {
  let result: Array<ChatCompletionResponseMessage> = [];
  let prevAuthor: string | null = null;

  history.forEach(
    (msg: {
      content: string;
      id: any;
      author: { id: string | null; bot: any };
    }) => {
      if (msg.content.startsWith("!") || msg.id === prompt.id) {
        return;
      }

      prevAuthor = msg.author.id;

      let response: ChatCompletionResponseMessage | undefined;
      if (msg.author.id === client.user.id) {
        response = {
          role: "assistant",
          content: `${client.user.username} ${config.separator} ${msg.content}`,
        };
      } else if (!msg.author.bot) {
        response = {
          role: "user",
          content: `${chatHeader(msg)} ${config.separator} ${sanitize(
            msg.content
          )}`,
        };
      }

      if (response) {
        result.push(response);
      }
    }
  );
  result.push({
    role: "user",
    content: `${prompt.member.nickname} \`${chatHeader(prompt)}\` ${
      config.separator
    } ${sanitize(prompt.content)}`,
  });
  if (config.system_prompts.hasOwnProperty("begin"))
    (config as Config).system_prompts["begin"].reverse().forEach((content: string) => {
      result.splice(1, 0, {
        role: "system",
        content: content
      })
    })
  if (config.system_prompts.hasOwnProperty("-1"))
    (config as Config).system_prompts["-1"].forEach((content: string) => {
      result.splice(-1, 0, {
        role: "system",
        content: content
      });
    });
  if (config.system_prompts.hasOwnProperty("end"))
    (config as Config).system_prompts["end"].forEach((content: string) => {
      result.push({
        role: "system",
        content: content
      })
    })

  console.log(result);
  return result;
}
