import { Module, Provider } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.orders';
import * as amqp from 'amqplib-as-promised';
import {
  inventory_delete_queue,
  inventory_delete_queue_resp,
  inventory_reserve_queue,
  inventory_reserve_queue_resp,
  inventory_reserve_rollback_queue,
  inventory_reserve_rollback_queue_resp,
  shipping_queue,
  shipping_queue_resp,
  shipping_rollback_queue,
  shipping_rollback_queue_resp,
} from './queue.types';

const providers: Provider[] = [
  {
    provide: RabbitMQService,
    useFactory: async () => {
      const connection = new amqp.Connection('amqp://localhost');
      await connection.init();
      const channel = await connection.createChannel();
      await channel.assertQueue(inventory_reserve_queue);
      await channel.assertQueue(shipping_queue);
      await channel.assertQueue(inventory_reserve_queue_resp);
      await channel.assertQueue(shipping_queue_resp);
      await channel.assertQueue(inventory_delete_queue);
      await channel.assertQueue(inventory_reserve_queue_resp);
      await channel.assertQueue(inventory_reserve_rollback_queue);
      await channel.assertQueue(inventory_reserve_rollback_queue_resp);
      await channel.assertQueue(shipping_rollback_queue);
      await channel.assertQueue(shipping_rollback_queue_resp);
      return new RabbitMQService(
        channel,
        inventory_reserve_queue,
        shipping_queue,
        inventory_reserve_queue_resp,
        shipping_queue_resp,
        inventory_delete_queue,
        inventory_delete_queue_resp,
        inventory_reserve_rollback_queue,
        inventory_reserve_rollback_queue_resp,
        shipping_rollback_queue,
        shipping_rollback_queue_resp,
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
