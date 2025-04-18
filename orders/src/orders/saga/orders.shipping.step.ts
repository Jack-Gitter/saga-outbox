import { ISagaStep } from 'src/saga/ISagaStep';
import { RabbitMQService } from '../rabbitmq/rabbitmq.orders';
import { OrdersOutboxMessage } from '../orders.outbox.entity';

export class ShippingStep implements ISagaStep {
  constructor(
    private rabbitMQService: RabbitMQService,
    private message: OrdersOutboxMessage,
  ) {}
  async invoke(): Promise<void> {
    console.debug('invoking shipping step!');
    await this.rabbitMQService.sendShippingMessage(
      this.message.product,
      this.message.quantity,
    );
  }
  async rollback(): Promise<void> {
    console.debug('invoking shipping rollback!');
    await this.rabbitMQService.sendShippingRollbackMessage(
      this.message.product,
      this.message.quantity,
    );
  }
}
