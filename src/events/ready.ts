import { on_ready_msg } from "../../config.json";
const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client: { user: { tag: string; username: string } }) {
    console.log(
      on_ready_msg
        .replace("${usertag}", client.user.tag)
        .replace("${username}", client.user.username)
    );
  },
};
