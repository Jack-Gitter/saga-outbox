import { ISagaStep } from 'src/saga/ISagaStep';
import { RabbitMQService } from '../rabbitmq/rabbitmq.orders';
import { OrdersOutboxMessage } from '../orders.outbox.entity';

export class ShippingStep implements ISagaStep {
  constructor(
    private rabbitMQService: RabbitMQService,
    private message: OrdersOutboxMessage,
  ) {}
  invoke(): void {
    console.debug('invoking shipping step!');
    this.rabbitMQService.sendShippingMessage(this.message);
  }
  rollback(): void {
    console.debug('invoking shipping rollback!');
    this.rabbitMQService.sendShippingRollbackMessage(this.message);
  }
}
