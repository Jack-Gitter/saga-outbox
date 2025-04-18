import { Module, Provider } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

const providers: Provider[] = [
  {
    provide: OrdersService,
    useClass: OrdersService,
  },
];

@Module({
  imports: [RabbitMQModule],
  providers: [...providers],
  controllers: [OrdersController],
})
export class OrdersModule {}
