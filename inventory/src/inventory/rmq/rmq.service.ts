import { Injectable } from '@nestjs/common';
import { Channel, Message } from 'amqplib-as-promised/lib';
import { INVENTORY_RESERVE, InventoryReserveMessage } from './rmq.types';

@Injectable()
export class RMQService {
  constructor(private channel: Channel) {}

  async registerInventoryReserveMessageHandler(
    fun: (message: InventoryReserveMessage) => Promise<void>,
  ) {
    this.channel.consume(INVENTORY_RESERVE, async (mes: Message) => {
      const content = JSON.parse(mes.content.toString());
      await fun({
        orderId: content.orderId,
        product: content.product,
        quantity: content.quantity,
      });
    });
  }
}
