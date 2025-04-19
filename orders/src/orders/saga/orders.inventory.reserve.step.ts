import { ISagaStep } from 'src/saga/ISagaStep';
import { RabbitMQService } from '../rabbitmq/rabbitmq.orders';
import { OrdersOutboxMessage } from '../orders.outbox.entity';

export class InventoryReserveStep implements ISagaStep {
  constructor(
    private rabbitMQService: RabbitMQService,
    private message: OrdersOutboxMessage,
  ) {}

  async invoke(): Promise<void> {
    console.debug('invoking inventory reserve step!');
    await this.rabbitMQService.sendInventoryReserveMessage(
      this.message.toJSON(),
    );
  }
  async rollback(): Promise<void> {
    console.debug('invoking inventory reserve rollback!');
    await this.rabbitMQService.sendInventoryReserveRollbackMessage(
      this.message.toJSON(),
    );
  }
}
