import { Module, Provider } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.orders';
import * as amqp from 'amqplib-as-promised';

const providers: Provider[] = [
  {
    provide: RabbitMQService,
    useFactory: async () => {
      const inventory_reserve_queue = 'INVENTORY_RESERVER_QUEUE';
      const inventory_reserve_queue_resp = 'INVENTORY_RESERVE_QUEUE_RESP';
      const inventory_delete_queue = 'INVENTORY_DELETE_QUEUE';
      const inventory_delete_queue_resp = 'INVENTORY_DELETE_QUEUE_RESP';
      const inventory_reserve_rollback_queue =
        'INVENTORY_RESERVE_ROLLBACK_QUEUE';
      const inventory_reserve_rollback_queue_resp =
        'INVENTORY_RESERVE_ROLLBACK_QUEUE';
      const shipping_queue = 'SHIPPING_QUEUE';
      const shipping_queue_resp = 'SHIPPING_QUEUE_RESP';
      const shipping_rollback_queue = 'SHIPPING_ROLLBACK_QUEUE';
      const shipping_rollback_queue_resp = 'SHIPPING_ROLLBACK_QUEUE_RESP';
      const connection = new amqp.Connection('amqp://localhost');
      await connection.init();
      const channel = await connection.createChannel();
      await channel.assertQueue(inventory_reserve_queue);
      await channel.assertQueue(shipping_queue);
      await channel.assertQueue(inventory_reserve_queue_resp);
      await channel.assertQueue(shipping_queue_resp);
      await channel.assertQueue(inventory_delete_queue);
      await channel.assertQueue(inventory_reserve_queue_resp);
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
