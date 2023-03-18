import dotenv from 'dotenv';
import Server from './server/server';
import kappashiro from './controller/kappashiro';
// import rabbit from './lib/rabbitmq';

dotenv.config();

(async () => {
  Server.bootstrap();
  // await rabbit.connect();
  // await rabbit.assertQueue(process.env.APP);
  await kappashiro.bot();
})();
