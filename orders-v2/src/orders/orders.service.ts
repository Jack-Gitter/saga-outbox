import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from './orders.entity';
import { OrdersOutboxMessage } from './orders.outbox.entity';
import { ClientProxy } from '@nestjs/microservices';
import { ORDERS_RMQ_CLIENT } from './orders.symbols';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    @Inject(ORDERS_RMQ_CLIENT) private rmqClient: ClientProxy,
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
        this.rmqClient.emit('INVENTORY_RESERVE', message.toJSON());
      });

      console.log('here!');
      await orderOutboxRepo.remove(outboxMessages);
    }, 5000);
  }
}
