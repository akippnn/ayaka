# Ayaka Project
Ayaka is a Discord Chatbot that uses the OpenAI's Chat Completion API.

Feel free to change the bot parameters at `./src/config.json`.

This project is still heavily work-in-progress and I am currently learning TypeScript (while I'm still working on my priorities), but the code should be heavily reworked at some point.

## Future branding
Ayaka Project may be renamed to a more appropriate project name after I consider it feature-complete.

## Version 1.1
> <picture>
>   <source media="(prefers-color-scheme: light)" srcset="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/light-theme/issue.svg">
>   <img alt="Issue" src="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/dark-theme/issue.svg">
> </picture><br>
>
>See pull request [#1](https://github.com/akippnn/ayaka/pull/1)

The next upcoming update will add a couple of quality-of-life improvements. Improvements such as:
- Multi-container Docker applications, for easier application management and deployment 
- Semaphores, to control access to the API, waiting for the previous message to be generated before generating a new one.
- Return and record the total token usage for each user.

## Future additions
- Token usage interface
- Analyze chat history with a GPT-3 model (preferably Babbage or lower)
- Analyze chat inputs with Ada for user profiling
- Bot and user profiles
- Possibly explore voice communication with the use of speech synthesizers and [OpenAI Whisper](https://github.com/openai/whisper)
