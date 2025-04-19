import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from './orders.entity';
import { OrdersOutboxMessage } from './orders.outbox.entity';
import { OrdersSagaOrchestrator } from './saga/orders.orchestrator';
import { InventoryReserveStep } from './saga/orders.inventory.reserve.step';
import { RabbitMQService } from './rabbitmq/rabbitmq.orders';
import { ShippingStep } from './saga/orders.shipping.step';
import { InventoryDeleteStep } from './saga/orders.inventory.delete.step';

@Injectable()
export class OrdersService {
  private runningSagas: Map<number, OrdersSagaOrchestrator>;

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

      console.debug('found messages!');
      console.debug(outboxMessages);

      const orchestrators = outboxMessages.map((message) => {
        const orchestrator = this.constructOrchestrator(message);
        this.runningSagas.set(message.id, orchestrator);
        return orchestrator;
      });

      await Promise.all(
        orchestrators.map(async (orchestrator) => {
          await orchestrator.invokeNext();
        }),
      );

      await orderOutboxRepository.remove(outboxMessages);
    }, 5000);
  }

  async setupResponseChannelMessageRouter() {
    // listen on rabbitmq channels for response messages
    // when we've been given a response message, check the messageID, and route it to the corresponding orchestrator
    // either call invokeNext() or rollback(), depending on what type of message we get?
  }

  constructOrchestrator(message: OrdersOutboxMessage) {
    const reserveInventoryStep = new InventoryReserveStep(
      this.rabbitMQ,
      message,
    );
    const shippingStep = new ShippingStep(this.rabbitMQ, message);
    const deleteInventoryStep = new InventoryDeleteStep(this.rabbitMQ, message);

    return new OrdersSagaOrchestrator([
      reserveInventoryStep,
      shippingStep,
      deleteInventoryStep,
    ]);
  }
}
