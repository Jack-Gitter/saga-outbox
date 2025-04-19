import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dtos/orders.create.dto';

@Controller('Order')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async placeOrder(@Body() body: CreateOrderDTO) {
    await this.ordersService.createPendingOrder(body.product, body.quantity);
  }
}
