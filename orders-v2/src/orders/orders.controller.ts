import { Body, Controller, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrdersService } from './orders.service';
import { Order } from './orders.entity';
import { OrdersOutboxMessage } from './orders.outbox.entity';
import { CreateOrderDTO } from './dtos/orders.create.dto';

@Controller('Order')
export class OrdersController {
  constructor(
    private dataSource: DataSource,
    private ordersService: OrdersService,
  ) {}

  @Post()
  async placeOrder(@Body() body: CreateOrderDTO) {
    await this.dataSource.transaction(async (entityManager) => {
      const orderRepo = entityManager.getRepository(Order);
      const orderOutboxRepo = entityManager.getRepository(OrdersOutboxMessage);
      const order = new Order(body.product, body.quantity);
      const savedOrder = await orderRepo.save(order);
      const outboxMessage = new OrdersOutboxMessage(
        body.product,
        body.quantity,
        savedOrder.id,
      );
      await orderOutboxRepo.save(outboxMessage);
    });
  }
}
