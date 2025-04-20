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

  async onModuleInit() {
    await this.pollOrderOutbox();
    await this.rmqService.registerInventoryReserveMessageResponseHandler(
      this.handleInventoryReserveResponse,
    );
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

      await Promise.all(
        outboxMessages.map(async (mes) => {
          await this.rmqService.sendInventoryReserveMessage(mes);
        }),
      );

      await orderOutboxRepo.remove(outboxMessages);
    }, 5000);
  }

  async handleInventoryReserveResponse(mes: MessageResponse) {
    const orderRepo = this.dataSource.getRepository(Order);
    if (!mes.successful) {
      console.debug(`Could not reserve inventory`);
      await orderRepo.delete({ id: mes.orderId });
    }
    const order = await orderRepo.findOneBy({ id: mes.orderId });
    const outboxMessage = new OrdersOutboxMessage(
      order.product,
      order.quantity,
      order.id,
    );
    await this.rmqService.sendShippingValidationMessage(outboxMessage);
  }
}
