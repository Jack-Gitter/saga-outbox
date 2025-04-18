import { ISagaStep } from 'src/saga/ISagaStep';
import { RabbitMQService } from '../rabbitmq/rabbitmq.orders';
import { OrdersOutboxMessage } from '../orders.outbox.entity';

export class ShippingStep implements ISagaStep {
  constructor(
    private rabbitMQService: RabbitMQService,
    private message: OrdersOutboxMessage,
  ) {}
  async invoke(): Promise<void> {
    this.rabbitMQService.sendShippingMessage(
      this.message.product,
      this.message.quantity,
    );
  }
  async rollback(): Promise<void> {}
}
