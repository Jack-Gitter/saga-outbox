import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from './orders.entity';
import { OrdersOutboxMessage } from './orders.outbox.entity';

@Injectable()
export class OrdersService {
  constructor(private dataSource: DataSource) {}

  onModuleInit() {
    this.pollOrderOutbox();
  }
  async initiateOrder(product: number, quantity: number) {
    await this.dataSource.transaction(async (entityManager) => {
      await entityManager.save(new Order(product, quantity));
      await entityManager.save(new OrdersOutboxMessage(product, quantity));
    });
  }

  async pollOrderOutbox() {
    setInterval(async () => {
      const orderOutboxRepository =
        this.dataSource.getRepository(OrdersOutboxMessage);
      const outboxMessages = await orderOutboxRepository.find();
      console.log(outboxMessages);
    }, 5000);
  }
}
