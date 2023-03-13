import { event } from "../components";
import { on_ready_msg } from "../config.json";

export default event('ready', ({ log }, client) => {
  log(on_ready_msg.replace("${usertag}", client.user.tag).replace("${username}", client.user.username));
})