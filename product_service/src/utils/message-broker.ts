import * as amqp from "amqplib";
import config from "../config";

export const connect = async () => {
  const connection = await amqp.connect(config.amqplib.message_broker_url);
  const channel = await connection.createChannel();
  await channel.assertExchange(config.amqplib.exchange_name, "direct", {
    durable: false,
  });
  return channel;
};

export const publish = async (
  channel: amqp.Channel,
  binding_key: string,
  message: string
) => {
  try {
    console.log("START PUBLISH");
    await channel.publish(
      config.amqplib.exchange_name,
      binding_key,
      Buffer.from(message)
    );
  } catch (error) {
    throw error;
  }
};

// export const consume = async (channel: amqp.Channel, service: Produ) => {
//   const appQueue = await channel.assertQueue(config.amqplib.queue_name);

//   channel.bindQueue(
//     appQueue.queue,
//     config.amqplib.exchange_name,
//     config.amqplib.customer_binding_key
//   );

//   channel.consume(appQueue.queue, (data) => {
//     if (data) {
//       service.subscribeEvents(data.content.toString());
//       channel?.ack;
//     } else {
//       console.log("Consume fail");
//     }
//   });
// };
