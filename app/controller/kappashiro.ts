import { logger } from '../lib/logger';
import * as Discord from 'discord.js';
// import user from '../lib/user';

const client = new Discord.Client();

const kappashiro = {
  bot: async () => {
    try {
      client.on('ready', async () => {
        client.user.setPresence({
          status: 'online',
          activity: {
            name: `${process.env.PREFIX}help`,
            type: 'PLAYING',
          },
        });
      });

      const statuses = [
        {
          activity: {
            name: `${process.env.PREFIX}help`,
          },
          type: 'PLAYING',
        },
      ];

      let i = 0;

      setInterval(() => {
        i = i >= statuses.length ? 0 : i;
        const status = statuses[i++];
        client.user.setPresence(status);
      }, 1000 * 60 * 60);

      client.on('message', async (message) => {
        if (message.author.bot || !message.content.startsWith(process.env.PREFIX)) {
          return;
        }

        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);

        const command = args.shift()?.toLowerCase();

        if (!command) {
          return;
        }

        logger.info(`command: ${command}`);

        switch (command) {
          case 'ping':
            message.channel.send('pong');
            break;

          case 'help':
            message.channel.send(`
            bot made by: 🍪 𝑲𝒆𝒗𝒊𝒏 𝒍 𝑻𝒊𝒏𝒆𝒔𝒉#6426
            commands:
            **.purge <number>** - Command to delete messages between the value 1 to 100
            **.avatar <user>** - Command to show someone's profile picture
            **.pet <user>** - Command to show your affection to someone
            **.play <number>** - Work in progress
          `);
            break;

          case 'purge':
            const amount = parseInt(args[0], 10);
            if (isNaN(amount) || amount <= 0 || amount > 100) {
              return await message.reply('You must enter a number between 1 and 100');
            }
            if (message.channel.type === 'text') {
              await message.channel.bulkDelete(amount, true);
            }
            break;

          case 'avatar':
            const user =
              message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
            const avatar = user.avatarURL({
              dynamic: true,
              format: 'png',
              size: 1024,
            });
            const embed = new Discord.MessageEmbed()
              .setColor(`#00000`)
              .setTitle(`Avatar from ${user.username}`)
              .setImage(avatar);
            message.channel.send(embed);
            break;

          case 'pet':
            const member = message.mentions.members.first() || message.member;
            const avatarUrl = member.user.displayAvatarURL({
              format: 'jpg',
            });
            const animatedGif = await user.pet(avatarUrl);
            message.channel.send(new Discord.MessageAttachment(animatedGif, 'pet.gif'));
            break;

          case 'gun':
            return;

          default:
            return;
        }
      });

      client.login(process.env.TOKEN);
    } catch (e) {
      logger.error(e.message);
    }
  },
};

export default kappashiro;
