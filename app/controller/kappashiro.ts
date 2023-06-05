import { logger } from '../lib/logger';
import fs from 'fs';
import User from '../lib/user';
import axios from 'axios';
import Discord from 'discord.js';

class KappashiroBot {
  private client: Discord.Client | any;

  constructor() {
    this.client = new Discord.Client();
  }

  public start(): void {
    try {
      this.client.on('ready', () => {
        this.client.user.setPresence({
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
      let status = statuses[i];

      setInterval(() => {
        if (!status) {
          status = statuses[0];
          i = 0;
        }
        this.client.user.setPresence(status);
        i++;
      }, 1000 * 60 * 60);

      this.client.on('message', async (message: any) => {
        if (
          message.content.includes('http') &&
          !message.content.includes('gif') &&
          !message.content.includes('mp4') &&
          !message.content.includes('webm') &&
          !message.content.includes('mov')
        ) {
          logger.info(`url: ${message.content}`);
          await message.react('🥒');
          return;
        }

        if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) {
          return;
        }

        const args = message.content
          .slice(process.env.PREFIX ? process.env.PREFIX.length : '.'.length)
          .trim()
          .split(/ +/g);
        const command = args.shift()?.toLowerCase();

        if (command === 'ping') {
          message.channel.send('pong');
        } else if (command === 'help') {
          message.channel.send(`
            bot made by: кєνιn | тιnєѕн#6426
            commands:
            **.purge <number>** - Command to delete messages between the value 1 to 100
            **.avatar <user>** - Command to show someone's profile picture
            **.pet <user>** - Command to show your affection to someone
            **.play <number>** - Work in progress
          `);
        } else if (command === 'purge') {
          const amount = parseInt(args[0]);
          if (isNaN(amount)) {
            return await message.reply('Invalid value');
          } else if (amount <= 0 || amount > 100) {
            return await message.reply('You must enter a number between 1 and 100');
          }
          if (message.channel.type === 'text') {
            await message.channel.bulkDelete(amount, true);
          }
        } else if (command === 'avatar') {
          const user =
            message.mentions.users.first() ||
            this.client.users.cache.get(args[0]) ||
            message.author;
          const avatar = user.avatarURL({
            dynamic: true,
            format: 'png',
            size: 1024,
          });
          const embed = new Discord.MessageEmbed()
            .setColor('#00000')
            .setTitle(`Avatar from ${user.username}`)
            .setImage(avatar);
          message.channel.send(embed);
        } else if (command === 'pet') {
          const member = message.mentions.members.first() || message.member;
          const avatar = member.user.displayAvatarURL({
            format: 'jpg',
          });
          const animatedGif = await User.pet(avatar);
          message.channel.send(new Discord.MessageAttachment(animatedGif, 'pet.gif'));
        } else if (command === 'gun') {
          return;
        } else if (command === 'play') {
          const VC = message.member.voice.channel;
          if (!VC) {
            return await message.reply('You are not connected to the voice channel');
          }
          await VC.join().then(async (connection: any) => {
            if (args[0] === 'random') {
              const playfile = fs.createWriteStream('app/resources/media/audios/random.mp3');
              await axios({
                method: 'get',
                url: `${process.env.MYINSTANTS_URL}/?type=file`,
                responseType: 'stream',
              }).then(async (response) => {
                response.data.pipe(playfile);
                const dispatcher = connection.play('app/resources/media/audios/random.mp3');
                dispatcher.on('finish', () => {
                  // VC.leave()
                });
              });
            } else {
              const playfile = fs.createWriteStream('app/resources/media/audios/play.mp3');
              await axios({
                method: 'get',
                url: `${process.env.MYINSTANTS_URL}/?type=file&id=${args[0]}`,
                responseType: 'stream',
              }).then(async (response) => {
                response.data.pipe(playfile);
                const dispatcher = connection.play('app/resources/media/audios/play.mp3');
                dispatcher.on('finish', () => {
                  // VC.leave()
                });
              });
            }
          });
        } else if (command === 'summon') {
          const channel = message.member.voice.channel;
          message.guild.members.cache.forEach((member: any) => {
            if (member.roles.cache.has(message.mentions.roles.first())) {
              message.channel.send(`${message.author} is moving users to a VC`);
              return member.voice.setChannel(channel);
            } else {
              message.channel.send(`${message.author} you need to specify a role`);
            }
          });
        }
      });

      this.client.login(process.env.TOKEN);
    } catch (e: any) {
      logger.error(e.message);
    }
  }
}

export default KappashiroBot;
