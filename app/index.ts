import * as dotenv from 'dotenv';
dotenv.config();
import Server from './server/server';
import kappashiro from "./controller/kappashiro";
import rabbit from './lib/rabbitmq';

(async function() {
    Server.bootstrap();
    await rabbit.connect();
    await rabbit.assertQueue(`${process.env.APP}`);
    await kappashiro.bot();
})();
