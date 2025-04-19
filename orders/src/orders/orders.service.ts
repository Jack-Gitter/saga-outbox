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
import { STATUS } from './orders.enums';

@Injectable()
export class OrdersService {
  private runningSagas: Map<number, OrdersSagaOrchestrator>;

  constructor(
    private dataSource: DataSource,
    private rabbitMQ: RabbitMQService,
  ) {
    this.runningSagas = new Map();
  }

  async onModuleInit() {
    await this.createSagaFromPendingOrders();
    this.pollOrderOutbox();
    this.rabbitMQ.registerInventoryReserveMessageResponseListener(
      this.invokeSagaStepCallback(ORDERS_SAGA_STEP.PROCESS_SHIPPING, []),
    );
    this.rabbitMQ.registerSendShippingResponseHandler(
      this.invokeSagaStepCallback(ORDERS_SAGA_STEP.DELETE_INVENTORY, [
        ORDERS_SAGA_STEP.RESERVE_INVENTORY,
      ]),
    );
    this.rabbitMQ.registerSendInventoryDeleteMessageListener(
      this.invokeSagaStepCallback(null, [
        ORDERS_SAGA_STEP.PROCESS_SHIPPING,
        ORDERS_SAGA_STEP.RESERVE_INVENTORY,
      ]),
    );
  }
  async initiateOrder(product: number, quantity: number) {
    await this.dataSource.transaction(async (entityManager) => {
      const order = await entityManager.save(new Order(product, quantity));
      await entityManager.save(
        new OrdersOutboxMessage(product, quantity, order.id),
      );
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
        this.runningSagas.set(message.orderId, orchestrator);
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

  invokeSagaStepCallback(
    toInvoke: ORDERS_SAGA_STEP,
    toRollback: ORDERS_SAGA_STEP[],
  ) {
    return (message: Message) => {
      const response = JSON.parse(message.content.toString());
      const relatedSaga = this.runningSagas.get(response.orderId);
      if (!relatedSaga) {
        throw new InternalServerErrorException(
          `No running saga is related to the most recent message recieved!`,
        );
      }
      if (response.successfull && toInvoke) {
        relatedSaga.invokeStep(toInvoke);
      } else {
        toRollback.forEach((step) => relatedSaga.compensateStep(step));
      }
    };
  }

  async createSagaFromPendingOrders() {
    const repo = this.dataSource.getRepository(Order);
    const pendingOrders = await repo.findBy({ status: STATUS.PENDING });
    const messages = pendingOrders.map((order) => {
      return new OrdersOutboxMessage(order.product, order.quantity, order.id);
    });
    messages.forEach((message) => {
      const orchestrator = this.constructOrchestrator(message);
      this.runningSagas.set(message.orderId, orchestrator);
    });
  }

  constructOrchestrator(message: OrdersOutboxMessage) {
    const reserveInventoryStep = new InventoryReserveStep(
      this.rabbitMQ,
      message.product,
      message.quantity,
      message.orderId,
    );
    const shippingStep = new ShippingStep(
      this.rabbitMQ,
      message.product,
      message.quantity,
      message.orderId,
    );
    const deleteInventoryStep = new InventoryDeleteStep(
      this.rabbitMQ,
      message.product,
      message.quantity,
      message.orderId,
    );

    const steps = new Map<ORDERS_SAGA_STEP, ISagaStep>();
    steps.set(ORDERS_SAGA_STEP.RESERVE_INVENTORY, reserveInventoryStep);
    steps.set(ORDERS_SAGA_STEP.PROCESS_SHIPPING, shippingStep);
    steps.set(ORDERS_SAGA_STEP.DELETE_INVENTORY, deleteInventoryStep);

    return new OrdersSagaOrchestrator(steps);
  }
}
