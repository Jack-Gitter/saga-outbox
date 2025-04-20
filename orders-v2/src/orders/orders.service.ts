import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from './orders.entity';
import { OrdersOutboxMessage } from './orders.outbox.entity';
import { RMQService } from './rmq/rmq.service';
import { MessageResponse } from './orders.types';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    private rmqService: RMQService,
  ) {}

  onModuleInit() {
    this.pollOrderOutbox();
  }
  async createPendingOrder(product: number, quantity: number) {
    await this.dataSource.transaction(async (entityManager) => {
      const orderRepo = entityManager.getRepository(Order);
      const orderOutboxRepo = entityManager.getRepository(OrdersOutboxMessage);
      const order = new Order(product, quantity);
      const savedOrder = await orderRepo.save(order);
      const outboxMessage = new OrdersOutboxMessage(
        product,
        quantity,
        savedOrder.id,
      );
      await orderOutboxRepo.save(outboxMessage);
    });
  }

  async pollOrderOutbox() {
    setInterval(async () => {
      const orderOutboxRepo =
        this.dataSource.getRepository(OrdersOutboxMessage);
      const outboxMessages = await orderOutboxRepo.find();

      console.debug('found messages!');
      console.debug(outboxMessages);

      outboxMessages.forEach((message) => {
        this.rmqService.sendInventoryReserveMessage(message);
      });

      await orderOutboxRepo.remove(outboxMessages);
    }, 5000);
  }

  async handleInventoryReserveResponse(mes: MessageResponse) {
    if (!mes.successful) {
      console.debug(`Could not reserve inventory`);
      const orderRepo = this.dataSource.getRepository(Order);
      await orderRepo.delete({ id: mes.orderId });
    }
  }
}
