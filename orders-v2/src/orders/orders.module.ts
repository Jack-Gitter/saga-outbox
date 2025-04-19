import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDERS_RMQ_CLIENT } from './orders.symbols';

@Module({
  imports: [
    ClientsModule.register([
      { name: ORDERS_RMQ_CLIENT, transport: Transport.RMQ },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
