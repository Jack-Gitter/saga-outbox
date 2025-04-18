import { ISagaStep } from 'src/saga/ISagaStep';
import { RabbitMQService } from '../rabbitmq/rabbitmq.orders';
import { OrdersOutboxMessage } from '../orders.outbox.entity';

export class InventoryReserveStep implements ISagaStep {
  constructor(
    private rabbitMQService: RabbitMQService,
    private message: OrdersOutboxMessage,
  ) {}

  async invoke(): Promise<void> {
    console.debug('invoking inventory step!');
    await this.rabbitMQService.sendInventoryReserveMessage(
      this.message.product,
      this.message.quantity,
    );
  }
  async rollback(): Promise<void> {
    console.debug('invoking inventory rollback!');
    console.debug('nothing to do, was simply a check!');
  }
}
