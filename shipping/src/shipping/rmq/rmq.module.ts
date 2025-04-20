import { Module, Provider } from '@nestjs/common';
import { RMQService } from './rmq.service';
import { Connection } from 'amqplib-as-promised/lib';
import { SHIPPING_VALIDATION, SHIPPING_VALIDATION_RESPONSE } from './rmq.types';

const providers: Provider[] = [
  {
    provide: RMQService,
    useFactory: async () => {
      const connection = new Connection('amqp://localhost');
      await connection.init();
      const channel = await connection.createChannel();
      await channel.assertQueue(SHIPPING_VALIDATION);
      await channel.assertQueue(SHIPPING_VALIDATION_RESPONSE);
      return new RMQService(channel);
    },
  },
];
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class RMQModule {}
