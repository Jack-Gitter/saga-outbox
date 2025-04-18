import { Module, Provider } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.orders';
import * as amqp from 'amqplib-as-promised';

const providers: Provider[] = [
  {
    provide: RabbitMQService,
    useFactory: async () => {
      const inventory_queue = 'INVENTORY_CHANNEL';
      const shipping_queue = 'SHIPPING_CHANNEL';
      const inventory_queue_resp = 'INVENTORY_CHANNEL_RESP';
      const shipping_queue_resp = 'SHIPPING_CHANNEL_RESP';
      const connection = new amqp.Connection('amqp://localhost');
      await connection.init();
      const channel = await connection.createChannel();
      await channel.assertQueue(inventory_queue);
      await channel.assertQueue(shipping_queue);
      return new RabbitMQService(
        channel,
        inventory_queue,
        shipping_queue,
        inventory_queue_resp,
        shipping_queue_resp,
      );
    },
  },
];

@Module({
  imports: [],
  providers: [...providers],
  exports: [...providers],
})
export class RabbitMQModule {}
