import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from './orders.entity';
import { OrdersOutboxMessage } from './orders.outbox.entity';
import { OrdersSagaOrchestrator } from './saga/orders.orchestrator';
import { InventoryStep } from './saga/orders.inventory.step';
import { RabbitMQService } from './rabbitmq/rabbitmq.orders';
import { ShippingStep } from './saga/orders.shipping.step';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    private rabbitMQ: RabbitMQService,
  ) {}

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

      const orchestrators = outboxMessages.map((message) =>
        this.constructOrchestrator(message),
      );

      await Promise.all(
        orchestrators.map(async (orchestrator) => {
          await orchestrator.begin();
        }),
      );

      await orderOutboxRepository.remove(outboxMessages);
    }, 5000);
  }

  constructOrchestrator(message: OrdersOutboxMessage) {
    const inventoryStep = new InventoryStep(this.rabbitMQ, message);
    const shippingStep = new ShippingStep(this.rabbitMQ, message);
    return new OrdersSagaOrchestrator([inventoryStep, shippingStep]);
  }
}
