import {
    logger
} from '../lib/logger';
import * as amqp from 'amqplib';
import * as uuid from 'uuid';
declare const Buffer: {
    from: new(arg0: string) => any;
};

const rabbitMq = {
    sessions: {},
    connection: null,
    async connect() {
        try {
            this.connection = await amqp.connect(`amqp://${process.env.RABBIT_AUTH}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`);
        } catch (e) {
            logger.error(`connection on rabbitMq failed ${e.message} ${e.stack}`, e, {
                severity: 'critical',
                error: e.message
            });
        }
    },
    async sessionChannel() {
        return await this.connection.createConfirmChannel();
    },
    getChannel(queueId: string | number) {
        return this.sessions[queueId];
    },
    async createQueue(queueId: string | number) {
        this.sessions[queueId] = await this.sessionChannel();
        return await this.assertQueue(queueId);
    },
    async deleteQueue(queueId: {
        toString: () => any;
    }) {
        try {
            logger.info(`deleting queue ${queueId}`);
            let channel = this.getChannel(queueId);
            return await channel.deleteQueue(queueId.toString());
        } catch (e) {
            logger.error(`queue - ${queueId} - error to deleteQueue ${e.message} ${e.stack}`, e, {
                severity: 'critical',
                error: e.message
            });
        }
    },
    async assertQueue(queueId: {
        toString: () => any;
    }) {
        try {
            let channel = this.getChannel(queueId);
            return await channel.assertQueue(queueId.toString(), {
                durable: false
            });
        } catch (e) {
            logger.error(`queue - ${queueId} - error to assertQueue ${e.message} ${e.stack}`, e, {
                severity: 'critical',
                error: e.message
            });
        }
    },
    async consumer(queueId: any, concurrency: any, callback: any) {
        await this.concurrency(queueId, concurrency);
        let channel = this.getChannel(queueId);
        channel.consume(queueId, callback, {
            consumerTag: queueId,
            noAck: false
        });
    },
    concurrency(queueId: any, concurrency: any) {
        const channel = this.getChannel(queueId);
        return channel.prefetch(Number(concurrency));
    },
    ack(message: {
        fields: {
            routingKey: any;
        };
    }) {
        let channel = this.getChannel(message.fields.routingKey);
        return channel.ack(message);
    },
    destroy(queueId: any) {
        let channel = this.getChannel(queueId);
        return channel.cancel(queueId);
    },
    async registry(queueId: any, concurrency: any, processQueue = false) {
        await this.createQueue(queueId);
        if (processQueue) {
            return await this.consumer(
                queueId,
                concurrency,
                processQueue
            );
        }
    },
    send(queueId: any, message: {
        id: string;
    }) {
        const channel = this.getChannel(queueId);
        message.id = uuid.v4();
        channel.sendToQueue(queueId, new Buffer.from(JSON.stringify(message)), {}, (e: {
            message: any;stack: any;
        }, success: any) => {
            if (e) {
                console.log(
                    `RABBITMQ - failed to send message - ${e.message} - ${e.stack}`, {
                        severity: "critical",
                        error: e.message
                    }
                );
            }
        });
        return message.id;
    }
};

export default rabbitMq;
