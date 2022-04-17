import * as path from 'path';
import * as _ from 'lodash';
import * as GIFEncoder from 'gifencoder';
import * as Canvas from 'canvas';

const user = {
    pet: async (avatarURL: string | Buffer, options: Object | any = {}) => {
        const FRAMES: number = 10;
        const petGifCache = [];
        const defaultOptions: Object = {
            resolution: 128,
            delay: 20,
            backgroundColor: null,
        };

        options = _.defaults(options, defaultOptions);

        const encoder: any = new GIFEncoder(options.resolution, options.resolution);

        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(options.delay);
        encoder.setTransparent(0);

        const canvas: any = Canvas.createCanvas(options.resolution, options.resolution);
        const ctx: any = canvas.getContext('2d');

        const avatar: Object = await Canvas.loadImage(avatarURL);

        for (let i = 0; i < FRAMES; i++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (options.backgroundColor) {
                ctx.fillStyle = options.backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            const j: number = i < FRAMES / 2 ? i : FRAMES - i;

            const width: number = 0.8 + j * 0.02;
            const height: number = 0.8 - j * 0.05;
            const offsetX: number = (1 - width) * 0.5 + 0.1;
            const offsetY: number = (1 - height) - 0.08;

            if (i == petGifCache.length) petGifCache.push(await Canvas.loadImage(path.resolve(`./app/img/pet${i}.gif`)))

            ctx.drawImage(avatar, options.resolution * offsetX, options.resolution * offsetY, options.resolution * width, options.resolution * height);
            ctx.drawImage(petGifCache[i], 0, 0, options.resolution, options.resolution);

            encoder.addFrame(ctx);
        }

        encoder.finish();
        return encoder.out.getData();
    },
    gun: async (avatarURL: string | Buffer) => {
        return;
    },
    gum: async (avatarURL: string | Buffer) => {
        return;
    },
    bonk: async (avatarURL: string | Buffer) => {
        return;
    },
    dualwield: async (avatarURL: string | Buffer) => {
        return;
    },
    gospel: async (avatarURL: string | Buffer) => {
        return;
    },
    grab: async (avatarURL: string | Buffer) => {
        return;
    },
}

export default user;
