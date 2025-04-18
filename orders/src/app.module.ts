import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders/orders.entity';
import { OrdersOutboxMessage } from './orders/orders.outbox.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 1000,
      username: 'postgres',
      password: 'postgres',
      database: 'orders',
      entities: [Order, OrdersOutboxMessage],
    }),
  ],
})
export class AppModule {}
