import { ISagaStep } from 'src/saga/ISagaStep';
import { RabbitMQService } from '../rabbitmq/rabbitmq.orders';
import { OrdersOutboxMessage } from '../orders.outbox.entity';
export declare class InventoryStep implements ISagaStep {
    private rabbitMQService;
    private message;
    constructor(rabbitMQService: RabbitMQService, message: OrdersOutboxMessage);
    invoke(): Promise<void>;
    rollback(): Promise<void>;
}
