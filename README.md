# kappashiro-discord-bot

![unnamed (1)](https://user-images.githubusercontent.com/37316637/159203472-71d59f3f-2eb3-40ff-98ef-9cc49bef67ff.jpg)

This repository contains a Discord bot based on the character Nitori Kawashiro from Touhou. The bot is developed using TypeScript and provides various commands for interacting with Discord users.

## Commands

The bot supports the following commands:

- **pet**: Creates a GIF where the specified user receives a petting.
- **avatar**: Displays the avatar of the specified user.
- **purge**: Deletes previous messages from the chat.
- **help**: Lists all available commands.
- **ping**: Returns a simple response.
- Additionally, the bot periodically changes its Discord status using **setInterval()**.

## Libraries Used

The bot utilizes the following libraries:

- **axios**: A popular HTTP client for making API requests.
- **canvas**: A powerful library for drawing graphics and images.
- **discord.js**: The official Discord API library for Node.js.
- **express**: A fast and minimalist web framework for building APIs.
- **winston**: A versatile logging library for Node.js.

## Deployment

For automated deployment using Docker, the project provides a **shell.bash** file in the main directory. This file streamlines the deployment process.

## Linting and Formatting

To ensure code quality and consistent formatting, the project includes the following configuration files:

- **.eslintrc.json**: Configures ESLint for code linting.
- **.prettierrc.json**: Configures Prettier for code formatting.

Make sure to run linting and formatting checks using the provided scripts:

- **npm run lint:check**: Checks for linting issues.
- **npm run lint:fix**: Fixes linting issues automatically.
- **npm run format:check**: Checks for code formatting issues.
- **npm run format:write**: Fixes code formatting issues automatically.

These scripts will help maintain a clean and consistent codebase.
