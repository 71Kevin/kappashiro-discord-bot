# kappashiro-discord-bot

![unnamed (1)](https://user-images.githubusercontent.com/37316637/159203472-71d59f3f-2eb3-40ff-98ef-9cc49bef67ff.jpg)

This is a Discord bot based on the character Nitori Kawashiro from Touhou. The bot is entirely written in Typescript.

## Commands

- pet - creates a GIF with the username provided and returns a photo of the user receiving a petting
- avatar - displays the avatar of the specified user
- purge - deletes previous messages
- help - lists all available commands
- ping - returns a simple response
- The bot also changes its Discord status periodically using setInterval.

## Libraries Used

The following libraries were used in this project:

- amqplib
- axios
- canvas
- discord.js
- express
- winston

## Deployment

The project includes a shell.bash file in shellscript to facilitate automated deployment using Docker.

## Linting and Formatting

The project uses .eslintrc.json and .prettierrc.json for linting and formatting, respectively.
