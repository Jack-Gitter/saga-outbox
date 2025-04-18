import { ISagaStep } from 'src/saga/ISagaStep';
import { RabbitMQService } from '../rabbitmq/rabbitmq.orders';
import { OrdersOutboxMessage } from '../orders.outbox.entity';

export class InventoryStep implements ISagaStep {
  constructor(
    private rabbitMQService: RabbitMQService,
    private message: OrdersOutboxMessage,
  ) {}

  async invoke(): Promise<void> {
    await this.rabbitMQService.sendInventoryCheckMessage(
      this.message.product,
      this.message.quantity,
    );
  }
  async rollback(): Promise<void> {}
}
