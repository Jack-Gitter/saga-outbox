import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dto/orders.create.dto';

@Controller('order')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async placeOrder(@Body() body: CreateOrderDTO) {
    await this.ordersService.initiateOrder(body.product, body.quantity);
  }
}
