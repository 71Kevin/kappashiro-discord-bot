import * as dotenv from 'dotenv';
import Server from './server/server';
import KappashiroController from './controller/kappashiro';

dotenv.config();

async function startServer() {
  try {
    const port = process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000;

    const server = new Server(port);
    server.listen();

    const kappashiroController = new KappashiroController();
    kappashiroController.start();
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
