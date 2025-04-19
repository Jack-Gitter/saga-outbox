import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from './orders.entity';
import { OrdersOutboxMessage } from './orders.outbox.entity';
import { OrdersSagaOrchestrator } from './saga/orders.orchestrator';
import { InventoryReserveStep } from './saga/orders.inventory.reserve.step';
import { RabbitMQService } from './rabbitmq/rabbitmq.orders';
import { ShippingStep } from './saga/orders.shipping.step';
import { InventoryDeleteStep } from './saga/orders.inventory.delete.step';
import { Message } from 'amqplib';
import { ORDERS_SAGA_STEP } from './saga/orders.saga.enum';
import { ISagaStep } from 'src/saga/ISagaStep';

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
          await orchestrator.invokeStep(ORDERS_SAGA_STEP.RESERVE_INVENTORY);
        }),
      );

      await orderOutboxRepository.remove(outboxMessages);
    }, 5000);
  }

  async responseChannelMessageRouter(step: ORDERS_SAGA_STEP) {
    return (message: Message) => {
      const response = JSON.parse(message.content.toString());
      const relatedSaga = this.runningSagas.get(response.id);
      if (!relatedSaga) {
        throw new InternalServerErrorException(
          `No running saga is related to the most recent message recieved!`,
        );
      }
      relatedSaga.invokeStep(step);
    };
  }

  constructOrchestrator(message: OrdersOutboxMessage) {
    const reserveInventoryStep = new InventoryReserveStep(
      this.rabbitMQ,
      message,
    );
    const shippingStep = new ShippingStep(this.rabbitMQ, message);
    const deleteInventoryStep = new InventoryDeleteStep(this.rabbitMQ, message);

    const steps = new Map<ORDERS_SAGA_STEP, ISagaStep>();
    steps.set(ORDERS_SAGA_STEP.RESERVE_INVENTORY, reserveInventoryStep);
    steps.set(ORDERS_SAGA_STEP.PROCESS_SHIPPING, shippingStep);
    steps.set(ORDERS_SAGA_STEP.DELETE_INVENTORY, deleteInventoryStep);

    return new OrdersSagaOrchestrator(steps);
  }
}
