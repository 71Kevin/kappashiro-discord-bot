import path from 'path';
import _ from 'lodash';
import GIFEncoder from 'gifencoder';
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';

interface PetOptions {
  resolution: number;
  delay: number;
  backgroundColor: string | null;
}

class User {
  public async pet(avatarURL: string | Buffer, options: Partial<PetOptions> = {}): Promise<Buffer> {
    const FRAMES = 10;
    const petGifCache: any[] = [];
    const defaultOptions: PetOptions = {
      resolution: 128,
      delay: 20,
      backgroundColor: null,
    };

    options = _.defaults(options, defaultOptions);

    const encoder = new GIFEncoder(options.resolution, options.resolution);

    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(options.delay);
    encoder.setTransparent(0);

    const canvas = createCanvas(options.resolution, options.resolution);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    const avatar = await loadImage(avatarURL);

    for (let i = 0; i < FRAMES; i++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (options.backgroundColor) {
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const j = i < FRAMES / 2 ? i : FRAMES - i;

      const width = 0.8 + j * 0.02;
      const height = 0.8 - j * 0.05;
      const offsetX = (1 - width) * 0.5 + 0.1;
      const offsetY = 1 - height - 0.08;

      if (i === petGifCache.length) {
        petGifCache.push(await loadImage(path.resolve(`./app/img/pet${i}.gif`)));
      }

      ctx.drawImage(
        avatar,
        options.resolution * offsetX,
        options.resolution * offsetY,
        options.resolution * width,
        options.resolution * height,
      );
      ctx.drawImage(petGifCache[i], 0, 0, options.resolution, options.resolution);

      encoder.addFrame(ctx);
    }

    encoder.finish();
    return encoder.out.getData();
  }

  public async gun(): Promise<void> {
    return;
  }

  public async gum(): Promise<void> {
    return;
  }

  public async bonk(): Promise<void> {
    return;
  }

  public async dualwield(): Promise<void> {
    return;
  }

  public async gospel(): Promise<void> {
    return;
  }

  public async grab(): Promise<void> {
    return;
  }
}

export default User;
