export interface Config {
  chatbot_args: {
    model: string,
    temperature: number,
    top_p: number,
    max_tokens: number,
    presence_penalty: number,
    frequency_penalty: number,
    logit_bias: {
      [token: string]: number;
    }
  },
  settings: {
    history_messages_max: number,
    openai_err_retries: number
  },
  system_prompts: {
    begin: string[],
    "-1": string[],
    end: string[]
  },
  on_ready_msg: string,
  separator: string
}