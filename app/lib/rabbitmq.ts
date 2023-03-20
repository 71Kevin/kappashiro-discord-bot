import * as amqp from 'amqplib';
import { logger } from '../lib/logger';

interface QueueMessage {
  content: Buffer;
}

class RabbitMqService {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  async connect(): Promise<void> {
    const uri = `amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASS}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`;
    try {
      this.connection = await amqp.connect(uri);
      this.channel = await this.connection.createConfirmChannel();
    } catch (error: any) {
      logger.error(`Failed to connect to RabbitMQ: ${error.message}`, {
        severity: 'critical',
        error: error.message,
      });
      throw error;
    }
  }

  async assertQueue(queueName: string): Promise<amqp.Replies.AssertQueue> {
    try {
      const queue = await this.channel!.assertQueue(queueName, { durable: true });
      return queue;
    } catch (error: any) {
      logger.error(`Failed to assert queue ${queueName}: ${error.message}`, {
        severity: 'critical',
        error: error.message,
      });
      throw error;
    }
  }

  async consume(
    queueName: string,
    onMessage: (message: QueueMessage) => Promise<void>,
    concurrency = 1,
  ): Promise<amqp.Replies.Consume> {
    try {
      await this.channel!.prefetch(concurrency, true);
      const { consumerTag } = await this.channel!.consume(queueName, async (message) => {
        if (message) {
          try {
            await onMessage({ content: message.content });
            this.channel!.ack(message);
          } catch (error: any) {
            logger.error(`Failed to consume message: ${error.message}`, {
              severity: 'error',
              error: error.message,
            });
            this.channel!.nack(message);
          }
        }
      });
      return { consumerTag };
    } catch (error: any) {
      logger.error(`Failed to start consumer on queue ${queueName}: ${error.message}`, {
        severity: 'critical',
        error: error.message,
      });
      throw error;
    }
  }

  async send(queueName: string, message: string): Promise<void> {
    try {
      await this.channel!.sendToQueue(queueName, Buffer.from(message), {});
      logger.info(`Sent message to queue ${queueName}: ${message}`);
    } catch (error: any) {
      logger.error(`Failed to send message to queue ${queueName}: ${error.message}`, {
        severity: 'critical',
        error: error.message,
      });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error: any) {
      logger.error(`Failed to disconnect from RabbitMQ: ${error.message}`, {
        severity: 'error',
        error: error.message,
      });
      throw error;
    }
  }
}

export default new RabbitMqService();
