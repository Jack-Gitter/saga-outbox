import { Repository } from 'typeorm';
import { Order } from './orders.entity';
export declare class OrdersService {
    private ordersRepository;
    constructor(ordersRepository: Repository<Order>);
    initiateOrderSaga(product: number, quantity: number): Promise<void>;
}
