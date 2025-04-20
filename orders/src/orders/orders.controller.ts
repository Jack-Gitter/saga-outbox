import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dtos/orders.create.dto';
import { RMQService } from './rmq/rmq.service';
import {
  INVENTORY_REMOVE_RESPONSE,
  INVENTORY_RESERVE_RESPONSE,
  SHIPPING_VALIDATION_RESPONSE,
} from './rmq/rmq.types';

@Controller('Order')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private rmqService: RMQService,
  ) {}

  async OnApplicationBootstrap() {
    await this.ordersService.pollOrderOutbox();
    await this.rmqService.registerQueueResponseHandler(
      INVENTORY_RESERVE_RESPONSE,
      this.ordersService.handleInventoryReserveResponse.bind(
        this.ordersService,
      ),
    );
    await this.rmqService.registerQueueResponseHandler(
      SHIPPING_VALIDATION_RESPONSE,
      this.ordersService.handleShippingValidationResponse.bind(
        this.ordersService,
      ),
    );
    await this.rmqService.registerQueueResponseHandler(
      INVENTORY_REMOVE_RESPONSE,
      this.ordersService.handleInventoryRemoveResponse.bind(this.ordersService),
    );
  }

  @Post()
  async placeOrder(@Body() body: CreateOrderDTO) {
    await this.ordersService.createPendingOrder(body.product, body.quantity);
  }
}
