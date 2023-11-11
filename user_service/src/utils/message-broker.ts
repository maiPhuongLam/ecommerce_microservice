import * as amqp from "amqplib";

interface Message {
  content: string;
}

interface RabbitMQService {
  connect: (url: string) => Promise<void>;
  publish: (queue_name: string, message: Message) => Promise<void>;
  consume: (
    queue_name: string,
    callback: (message: Message) => Promise<void>
  ) => Promise<void>;
}

export class MessageBroker implements RabbitMQService {
  private connection: amqp.Connection | undefined;
  private channel: amqp.Channel | undefined;

  async connect(url: string) {
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue("my-queue", { durable: true });
  }

  async publish(queue_name: string, message: Message) {
    if (!this.channel) {
      throw new Error("Channel not initialized");
    }
    await this.channel.sendToQueue(queue_name, Buffer.from(message.content), {
      persistent: true,
    });
  }

  async consume(
    queue_name: string,
    callback: (message: Message) => Promise<void>
  ) {
    if (!this.channel) {
      throw new Error("Channel not initialized");
    }
    await this.channel.consume(queue_name, async (message) => {
      if (!message) {
        return;
      }
      const content = message.content.toString();
      await callback({ content });
      this.channel?.ack(message);
    });
  }
}
