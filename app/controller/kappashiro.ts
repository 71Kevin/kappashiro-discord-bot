import {
    logger
} from '../lib/logger';
import * as Discord from 'discord.js';
const client = new Discord.Client();
import * as fs from 'fs';
import axios from 'axios';
// import rabbit from '../lib/rabbitmq';

const kappashiro = {
    bot: async () => {
        try {
            client.on('ready', async () => {
                client.user.setPresence({
                    status: 'online',
                    activity: {
                        name: `${process.env.PREFIX}help`,
                        type: 'PLAYING'
                    }
                })
            });

            let statuses = [{
                activity: {
                    name: `${process.env.PREFIX}help`
                },
                type: "PLAYING"
            }];
            let i = 0;
            let status = statuses[i];

            setInterval(async () => {
                if (!status) {
                    status = statuses[0];
                    i = 0;
                }
                client.user.setPresence(status);
                i++;
            }, 1000 * 60 * 60);

            client.on('message', async message => {
                // await rabbit.send(`${process.env.APP}`, `${message}`);

                if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

                // rabbit.consume(process.env.APP, Number(process.env.CONCURRENCY), (message: any) => {}

                const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
                const command = args.shift().toLowerCase();

                if (command === 'ping') {
                    await message.channel.send('pong');

                } else if (command === 'help') {
                    logger.info(`help by ${message.author}`);
                    await message.channel.send('work-in-progress');

                } else if (command === 'purge') {
                    const amount = parseInt(args[0]);
                    console.log(`amount: ${amount}`);
                    if (isNaN(amount)) {
                        return await message.reply('Invalid value');
                    } else if (amount <= 0 || amount > 100) {
                        return await message.reply('You must enter a number between 1 and 100');
                    }
                    if (message.channel.type === 'text') await message.channel.bulkDelete(amount, true)

                } else if (command === 'avatar') {
                    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
                    let avatar = user.avatarURL({
                        dynamic: true,
                        format: "png",
                        size: 1024
                    });
                    let embed = new Discord.MessageEmbed()
                        .setColor(`#00000`)
                        .setTitle(`Avatar from ${user.username}`)
                        .setImage(avatar);
                    await message.channel.send(embed);

                } else if (command === 'play') {
                    let VC = message.member.voice.channel;
                    if (!VC) {
                        return await message.reply("You are not connected to the voice channel")
                    }
                    await VC.join()
                        .then(async connection => {
                            console.log(`file: ${args[0]}`);
                            if (args[0] === 'random') {
                                const playfile = fs.createWriteStream(`app/resources/media/audios/random.mp3`);
                                await axios({
                                    method: 'get',
                                    url: `${process.env.MYINSTANTS_URL}/?type=file`,
                                    responseType: 'stream',
                                }).then(async response => {
                                    response.data.pipe(playfile);
                                    const dispatcher = connection.play(`app/resources/media/audios/random.mp3`);
                                    dispatcher.on("finish", (end: any) => {
                                        // VC.leave()
                                    });
                                });
                            } else {
                                const playfile = fs.createWriteStream(`app/resources/media/audios/play.mp3`);
                                await axios({
                                    method: 'get',
                                    url: `${process.env.MYINSTANTS_URL}/?type=file&id=${args[0]}`,
                                    responseType: 'stream',
                                }).then(async response => {
                                    response.data.pipe(playfile);
                                    const dispatcher = connection.play(`app/resources/media/audios/play.mp3`);
                                    dispatcher.on("finish", (end: any) => {
                                        // VC.leave()
                                    });
                                });
                            }
                        })
                }
                // rabbit.ack(message);
            });
            client.login(process.env.TOKEN);
        } catch (e) {
            logger.error(e.message);
        }
    }
};

export default kappashiro;
