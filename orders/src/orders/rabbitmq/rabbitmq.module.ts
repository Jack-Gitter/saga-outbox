import { Module, Provider } from '@nestjs/common';
import { RabbitMQOrdersService } from './rabbitmq.orders';
import * as amqp from 'amqplib-as-promised';

const providers: Provider[] = [
  {
    provide: RabbitMQOrdersService,
    useFactory: async () => {
      const inventory_queue = 'INVENTORY_CHANNEL';
      const shipping_queue = 'SHIPPING_CHANNEL';
      const connection = new amqp.Connection('amqp://localhost');
      await connection.init();
      const channel = await connection.createChannel();
      await channel.assertQueue(inventory_queue);
      await channel.assertQueue(shipping_queue);
      return new RabbitMQOrdersService(
        channel,
        inventory_queue,
        shipping_queue,
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
