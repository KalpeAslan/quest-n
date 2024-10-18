import amqp from 'amqplib';

export const sendMessage = async (message, queueName) => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  message = JSON.stringify(message);
  await channel.assertQueue(queueName, { durable: true });
  await channel.sendToQueue(queueName, Buffer.from(message));
  await channel.close();
  await connection.close();
};

export const pullMessage = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queueName = process.env.COMPLETED_TASKS_RABBITMQ_QUEUE_NAME;

    await channel.assertQueue(queueName);
    const message = await channel.get(queueName);

    if (message) {
      // Acknowledge that the message has been consumed and should be removed from the queue
      channel.ack(message);
    }

    await channel.close();
    await connection.close();
    if (message.content) {
      return JSON.parse(message.content);
    }
    return undefined;
  } catch (error) {
    throw new Error('Failed to consume messages from RabbitMQ server');
  }
};
