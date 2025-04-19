import { ISagaStep } from 'src/saga/ISagaStep';
import { RabbitMQService } from '../rabbitmq/rabbitmq.orders';
import { OrdersOutboxMessage } from '../orders.outbox.entity';

export class InventoryDeleteStep implements ISagaStep {
  constructor(
    private rabbitMQService: RabbitMQService,
    private message: OrdersOutboxMessage,
  ) {}

  invoke(): void {
    console.debug('invoking inventory delete step!');
    this.rabbitMQService.sendInventoryDeleteMessage(this.message);
    // await this.rabbitMQService.waitForInventoryDeleteResponse(this.message)
  }
  rollback(): void {
    console.debug('invoking inventory delete rollback!');
    console.debug('nothing to do, the last step in the saga');
  }
}
