import keys from "../keys";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: keys.gptapiKey,
});

export default new OpenAIApi(configuration);