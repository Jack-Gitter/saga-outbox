import { Module, Provider } from '@nestjs/common';
import { RabbitMQOrdersService } from './rabbitmq.orders';
import * as amqp from 'amqplib-as-promised';

const providers: Provider[] = [
  {
    provide: RabbitMQOrdersService,
    useFactory: async () => {
      const inventory_channel = 'INVENTORY_CHANNEL';
      const shipping_channel = 'SHIPPING_CHANNEL';
      const connection = new amqp.Connection('amqp://localhost');
      await connection.init();
      const channel = await connection.createChannel();
      await channel.assertQueue(inventory_channel);
      await channel.assertQueue(shipping_channel);
      return new RabbitMQOrdersService(
        channel,
        inventory_channel,
        shipping_channel,
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
