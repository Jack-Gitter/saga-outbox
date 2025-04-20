import { Module, Provider } from '@nestjs/common';
import { RMQService } from './rmq.service';
import { Connection } from 'amqplib-as-promised/lib';
import {
  INVENTORY_REMOVE,
  INVENTORY_REMOVE_RESP,
  INVENTORY_RESERVE,
  INVENTORY_RESERVE_RESP,
} from './rmq.types';

const providers: Provider[] = [
  {
    provide: RMQService,
    useFactory: async () => {
      const connection = new Connection('amqp://localhost');
      await connection.init();
      const channel = await connection.createChannel();
      await channel.assertQueue(INVENTORY_RESERVE);
      await channel.assertQueue(INVENTORY_RESERVE_RESP);
      await channel.assertQueue(INVENTORY_REMOVE);
      await channel.assertQueue(INVENTORY_REMOVE_RESP);
      return new RMQService(channel);
    },
  },
];
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class RMQModule {}
