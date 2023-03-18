import express, { Express } from 'express';
import { logger } from '../lib/logger';
import router from './router';

class Server {
  private readonly app: Express;
  private readonly port: number;

  public constructor(port: number) {
    this.port = port;
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(express.json({ limit: '200MB' }));
  }

  private routes(): void {
    this.app.use(router);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      logger.info(`Server listening on port ${this.port}`);
    });
  }
}

export default Server;
