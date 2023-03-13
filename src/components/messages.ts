import { separator, system_prompts } from "../config.json";
import { currentTime, sanitize } from "../utils";
import { Collection } from "discord.js";
import { ChatCompletionResponseMessage } from "openai";
const { Client, Message } = require("discord.js");

interface ProcMsgArgs {
  client: typeof Client;
  prompt: typeof Message;
  history: Collection<string, typeof Message>;
}

function chatHeader(
  msg: typeof Message,
  prevAuthor?: string | undefined
) {
  return !msg.author.bot && prevAuthor === msg.author.id
    ? ""
    : `user ${msg.author.tag} time ${currentTime(msg.createdAt)}`;
}

export function processMessages({
  client,
  prompt,
  history,
}: ProcMsgArgs): Array<ChatCompletionResponseMessage> {
  let result: Array<ChatCompletionResponseMessage> = [];
  let prevAuthor: string | null = null;

  history.forEach((msg) => {
    if (msg.content.startsWith("!") || msg.id === prompt.id) {
      return;
    }

    prevAuthor = msg.author.id;

    let response: ChatCompletionResponseMessage | undefined;
    if (msg.author.id === client.user.id) {
      response = {
        role: "assistant",
        content: `${client.user.username} ${separator} ${msg.content}`,
      };
    } else if (!msg.author.bot) {
      response = {
        role: "user",
        content: `${chatHeader(msg)} ${separator} ${sanitize(msg.content)}`,
      };
    }

    if (response) {
      result.push(response);
    }
  });
  result.push({
    role: "user",
    content: `${prompt.member.nickname} \`${chatHeader(
      prompt
    )}\` ${separator} ${sanitize(prompt.content)}`,
  });
  system_prompts.forEach((content: string) => {
    result.splice(-2, 0, {
      role: "system",
      content: content.replace("${username}", client.user.username),
    });
  });

  console.log(result);
  return result;
}