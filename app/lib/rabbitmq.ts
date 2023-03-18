import { logger } from '../lib/logger';
import * as amqp from 'amqplib';

export default {
  connection: null as amqp.Connection | null,
  queues: null as amqp.ConfirmChannel | null,

  async connect() {
    try {
      const rabbitUri = `amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASS}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`;
      this.connection = await amqp.connect(rabbitUri);
      this.queues = await this.connection.createConfirmChannel();
    } catch (e) {
      logger.error(`connection on rabbitMq failed ${e.message} ${e.stack}`, e, {
        severity: 'critical',
        error: e.message,
      });
    }
  },

  async assertQueue(queueId: string) {
    try {
      const currentQueue = await this.queues.assertQueue(queueId, {
        durable: true,
      });
      return currentQueue;
    } catch (e) {
      logger.error(`queueId - ${queueId} - error to assertQueue ${e.message} ${e.stack}`, e, {
        severity: 'critical',
        error: e.message,
      });
      throw e;
    }
  },

  consume(
    queueId: string,
    concurrency: number,
    callback: (msg: amqp.ConsumeMessage | null) => void,
  ) {
    this.destroy(queueId);
    this.concurrency(concurrency);
    this.queues.consume(queueId, callback, {
      consumerTag: queueId,
      noAck: false,
    });
  },

  concurrency(quantity: number) {
    return this.queues.prefetch(quantity, true);
  },

  ack(message: amqp.Message) {
    return this.queues.ack(message);
  },

  destroy(queueId: string) {
    return this.queues.cancel(queueId);
  },

  async send(queueId: string, message: string) {
    try {
      await this.queues.sendToQueue(queueId, Buffer.from(message), {});
      logger.info(`sent: ${message}`);
    } catch (e) {
      logger.error(`queueId - ${queueId} - error to send message ${e.message} ${e.stack}`, e, {
        severity: 'critical',
        error: e.message,
      });
      throw e;
    }
  },
};
