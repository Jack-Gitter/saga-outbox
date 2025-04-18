import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dto/orders.create.dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    placeOrder(body: CreateOrderDTO): Promise<void>;
}
