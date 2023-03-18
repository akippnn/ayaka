import keys from "../keys";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: keys.gptApiKey,
});

export default new OpenAIApi(configuration);
