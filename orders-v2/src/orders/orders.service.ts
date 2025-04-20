import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from './orders.entity';
import { OrdersOutboxMessage } from './orders.outbox.entity';
import { RMQService } from './rmq/rmq.service';
import { MessageResponse } from './orders.types';
import { INVENTORY_RESERVE } from './orders.symbols';
import {
  INVENTORY_RESERVE_RESPONSE,
  SHIPPING_VALIDATION_RESPONSE,
} from './rmq/rmq.types';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    private rmqService: RMQService,
  ) {}

  async onApplicationBootstrap() {
    await this.pollOrderOutbox();
    await this.rmqService.registerQueueResponseHandler(
      INVENTORY_RESERVE_RESPONSE,
      this.handleInventoryReserveResponse.bind(this),
    );
    await this.rmqService.registerQueueResponseHandler(
      SHIPPING_VALIDATION_RESPONSE,
      this.handleInventoryReserveResponse.bind(this),
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
      return;
    }
    const order = await orderRepo.findOneByOrFail({ id: mes.orderId });
    const outboxMessage = new OrdersOutboxMessage(
      order.product,
      order.quantity,
      order.id,
    );
    await this.rmqService.sendShippingValidationMessage(outboxMessage);
  }

  async handleShippingValidationResponse(mes: MessageResponse) {
    const orderRepo = this.dataSource.getRepository(Order);
    const order = await orderRepo.findOneByOrFail({ id: mes.orderId });
    const outboxMessage = new OrdersOutboxMessage(
      order.product,
      order.quantity,
      order.id,
    );
    if (!mes.successful) {
      console.debug(`Could not validate shipping!`);
      await this.rmqService.sendCompensateInventoryReserveMessage(
        outboxMessage,
      );
      await orderRepo.delete({ id: mes.orderId });
      return;
    }
    await this.rmqService.sendInventoryRemoveMessage(outboxMessage);
  }
}
