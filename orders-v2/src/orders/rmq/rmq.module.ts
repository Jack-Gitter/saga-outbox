import { Module, Provider } from '@nestjs/common';
import { RMQService } from './rmq.service';
import { Connection } from 'amqplib-as-promised/lib';
import { INVENTORY_RESERVE } from '../orders.symbols';
import {
  INVENTORY_REMOVE,
  INVENTORY_REMOVE_RESPONSE,
  INVENTORY_RESERVE_RESPONSE,
  SHIPPING_VALIDATION,
  SHIPPING_VALIDATION_RESPONSE,
} from './rmq.types';

const providers: Provider[] = [
  {
    provide: RMQService,
    useFactory: async () => {
      const connection = new Connection('amqp://localhost');
      await connection.init();
      const channel = await connection.createChannel();
      await channel.assertQueue(INVENTORY_RESERVE);
      await channel.assertQueue(INVENTORY_RESERVE_RESPONSE);
      await channel.assertQueue(SHIPPING_VALIDATION);
      await channel.assertQueue(SHIPPING_VALIDATION_RESPONSE);
      await channel.assertQueue(INVENTORY_REMOVE);
      await channel.assertQueue(INVENTORY_REMOVE_RESPONSE);
      return new RMQService(channel);
    },
  },
];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class RMQModule {}
