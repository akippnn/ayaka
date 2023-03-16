import { generateReply } from "../components";
const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  async execute(message: any): Promise<void> {
    await generateReply(message);
  },
};
