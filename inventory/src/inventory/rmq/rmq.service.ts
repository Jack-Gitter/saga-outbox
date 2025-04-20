import { Injectable } from '@nestjs/common';
import { Channel, Message } from 'amqplib-as-promised/lib';
import { INVENTORY_RESERVE } from './rmq.types';

@Injectable()
export class RMQService {
  constructor(private channel: Channel) {}

  async registerInventoryReserveMessageHandler(
    fun: (id: number, product: number, quantity: number) => void,
  ) {
    this.channel.consume(INVENTORY_RESERVE, async (mes: Message) => {
      const content = JSON.parse(mes.content.toString());
      await fun(content.id, content.product, content.quantity);
    });
  }
}
