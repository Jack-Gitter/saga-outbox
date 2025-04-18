import { OrdersService } from './orders.service';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    placeOrder(product: number, quantity: number): Promise<void>;
}
