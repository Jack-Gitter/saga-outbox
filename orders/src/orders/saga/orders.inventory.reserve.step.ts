import { ISagaStep } from 'src/saga/ISagaStep';
import { RabbitMQService } from '../rabbitmq/rabbitmq.orders';
import { OrdersOutboxMessage } from '../orders.outbox.entity';

export class InventoryReserveStep implements ISagaStep {
  constructor(
    private rabbitMQService: RabbitMQService,
    private message: OrdersOutboxMessage,
  ) {}

  invoke(): void {
    console.debug('invoking inventory reserve step!');
    this.rabbitMQService.sendInventoryReserveMessage(this.message);
  }
  rollback(): void {
    console.debug('invoking inventory reserve rollback!');
    this.rabbitMQService.sendInventoryReserveRollbackMessage(this.message);
  }
}
