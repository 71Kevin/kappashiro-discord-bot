import * as dotenv from 'dotenv';
dotenv.config();
import Server from './server/server';
import kappashiro from './controller/kappashiro';

(async function () {
  const port = process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000;
  const server = new Server(port);
  server.listen();
  await kappashiro.bot();
})();
