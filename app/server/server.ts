import express from 'express';
import { logger } from '../lib/logger';
import router from './router';

class Server {
  public express: express.Application;

  public constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
    this.listen();
  }

  private middlewares(): void {
    this.express.use(
      express.json({
        limit: '200MB',
      }),
    );
  }

  private routes(): void {
    this.express.use(router);
  }

  private listen(): void {
    const port = process.env.APP_PORT || 3000;
    this.express.listen(port, () => {
      logger.info(`kappashiro-bot initialized on port: ${port} 🔊`);
    });
  }
}

export default new Server().express;
