import { Module, Provider } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { OrdersController } from './orders.controller';

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
