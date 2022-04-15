import {
    logger
} from '../lib/logger';
import * as amqp from 'amqplib';
import * as uuid from 'uuid';
declare const Buffer: {
    from: new(arg0: string) => any;
};

export default {
    connection: null,
    queues: null,
    async connect() {
        try {
            this.connection = await amqp.connect(
                `amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASS}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`
            );
            this.queues = await this.connection.createConfirmChannel();
        } catch (e) {
            logger.error(`connection on rabbitMq failed ${e.message} ${e.stack}`, e, {
                severity: 'critical',
                error: e.message
            });
        }
    },
    async assertQueue(queueId: {
        toString: () => any;
    }) {
        let currentQueue: any;
        try {
            currentQueue = await this.queues.assertQueue(queueId.toString(), {
                durable: true
            });
        } catch (e) {
            logger.error(`mailingId - ${queueId} - error to assertQueue ${e.message} ${e.stack}`, e, {
                severity: 'critical',
                error: e.message
            });
        }
        return currentQueue;
    },
    consume(queueId: any, concurrency: any, callback: {
        bind: (arg0: any) => any;
    }) {
        this.destroy(queueId);
        this.concurrency(concurrency);
        this.queues.consume(queueId, callback.bind(this), {
            consumerTag: queueId,
            noAck: false
        });
    },
    concurrency(quantity: any) {
        return this.queues.prefetch(Number(quantity), true);
    },
    ack(message: any) {
        return this.queues.ack(message);
    },
    destroy(queueId: any) {
        return this.queues.cancel(queueId);
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
