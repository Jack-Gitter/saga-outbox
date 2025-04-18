import { Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('order')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async placeOrder(product: number, quantity: number) {
    await this.ordersService.initiateOrder(product, quantity);
  }
}
