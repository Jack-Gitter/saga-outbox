import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from './orders.entity';
import { OrdersOutboxMessage } from './orders.outbox.entity';

@Injectable()
export class OrdersService {
  constructor(private dataSource: DataSource) {}

  async initiateOrder(product: number, quantity: number) {
    await this.dataSource.transaction(async (entityManager) => {
      const order = new Order(product, quantity);
      const outboxMessage = new OrdersOutboxMessage(product, quantity);
      await entityManager.save(order);
      await entityManager.save(outboxMessage);
    });
  }
}
