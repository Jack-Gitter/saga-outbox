import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders/orders.entity';
import { OrdersOutboxMessage } from './orders/orders.outbox.entity';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 1000,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Order, OrdersOutboxMessage],
    }),
    OrdersModule,
  ],
})
export class AppModule {}
