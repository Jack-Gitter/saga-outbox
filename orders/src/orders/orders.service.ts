import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository: Repository<Order>) {}

  async initiateOrderSaga(product: number, quantity: number) {
    const order = new Order(product, quantity);
    await this.ordersRepository.save(order);
    // kick off the saga here
  }
}

