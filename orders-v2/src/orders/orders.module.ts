import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { RMQModule } from './rmq/rmq.module';

@Module({
  imports: [RMQModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
