import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from './orders.entity';
import { OrdersOutboxMessage } from './orders.outbox.entity';
import { RMQService } from './rmq/rmq.service';
import { MessageResponse } from './orders.types';
import {} from './rmq/rmq.types';
import { STATUS } from './orders.enums';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    private rmqService: RMQService,
  ) {}

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
    console.debug(`Handling inventory reserve response message!`);
    console.debug(mes);
    const orderRepo = this.dataSource.getRepository(Order);
    if (!mes.successful) {
      console.debug(`Could not reserve inventory`);
      await orderRepo.delete({ id: mes.orderId });
      return;
    }
    try {
      const order = await orderRepo.findOneByOrFail({ id: mes.orderId });
      const outboxMessage = new OrdersOutboxMessage(
        order.product,
        order.quantity,
        order.id,
      );
      await this.rmqService.sendShippingValidationMessage(outboxMessage);
    } catch {
      console.debug(
        `The order has already been deleted when trying to compensate inventory reserve step`,
      );
    }
  }

  async handleShippingValidationResponse(mes: MessageResponse) {
    console.debug(`Handling shipping validation response message!`);
    console.debug(mes);
    try {
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
    } catch {
      console.debug(
        `Order has already been deleted when trying to compensate for shipping validation error`,
      );
    }
  }

  async handleInventoryRemoveResponse(mes: MessageResponse) {
    console.debug(`Handling inventory remove response message!`);
    console.debug(mes);
    try {
      const orderRepo = this.dataSource.getRepository(Order);
      const order = await orderRepo.findOneByOrFail({ id: mes.orderId });
      const outboxMessage = new OrdersOutboxMessage(
        order.product,
        order.quantity,
        order.id,
      );
      if (!mes.successful) {
        console.debug(`Could not delete inventory!`);
        await this.rmqService.sendCompensateInventoryReserveMessage(
          outboxMessage,
        );
        await orderRepo.delete({ id: mes.orderId });
      }
      order.status = STATUS.CONFIRMED;
      await orderRepo.save(order);
    } catch {
      console.debug(
        `Order has already been deleted when trying to compensate for order remove`,
      );
    }
  }
}
