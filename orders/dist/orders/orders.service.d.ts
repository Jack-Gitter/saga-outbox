import { DataSource } from 'typeorm';
import { OrdersOutboxMessage } from './orders.outbox.entity';
import { OrdersSagaOrchestrator } from './saga/orders.orchestrator';
import { RabbitMQService } from './rabbitmq/rabbitmq.orders';
export declare class OrdersService {
    private dataSource;
    private rabbitMQ;
    constructor(dataSource: DataSource, rabbitMQ: RabbitMQService);
    onModuleInit(): void;
    initiateOrder(product: number, quantity: number): Promise<void>;
    pollOrderOutbox(): Promise<void>;
    constructOrchestrator(message: OrdersOutboxMessage): OrdersSagaOrchestrator;
}
