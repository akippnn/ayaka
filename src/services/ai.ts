import keys from "../keys";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: keys.gptApiKey,
});

export default new OpenAIApi(configuration);
