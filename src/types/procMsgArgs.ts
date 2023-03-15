const { Client, Collection, Message } = require("discord.js");

interface ProcMsgArgs {
  client: typeof Client;
  prompt: typeof Message;
  history: typeof Collection;
}
