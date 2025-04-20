import { Injectable } from '@nestjs/common';
import { Channel } from 'amqplib-as-promised/lib';
import { OrdersOutboxMessage } from '../orders.outbox.entity';
import { INVENTORY_RESERVE } from '../orders.symbols';

@Injectable()
export class RMQService {
  constructor(private channel: Channel) {}

  async sendInventoryReserveMessage(mes: OrdersOutboxMessage) {
    this.channel.sendToQueue(
      INVENTORY_RESERVE,
      Buffer.from(JSON.stringify(mes.toJSON())),
    );
  }
}
