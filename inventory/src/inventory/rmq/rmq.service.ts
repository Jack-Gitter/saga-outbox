import { Injectable } from '@nestjs/common';
import { Channel, Message } from 'amqplib-as-promised/lib';
import {
  INVENTORY_RESERVE,
  INVENTORY_RESERVE_RESP,
  InventoryReserveInboxMessage,
} from './rmq.types';
import { InventoryReserveOutboxMessageEntity } from '../inventory.reserve.outbox.message.entity';

@Injectable()
export class RMQService {
  constructor(private channel: Channel) {}

  async registerInventoryReserveMessageHandler(
    fun: (message: InventoryReserveInboxMessage) => Promise<void>,
  ) {
    await this.channel.consume(INVENTORY_RESERVE, async (mes: Message) => {
      const content = JSON.parse(mes.content.toString());
      await fun({
        orderId: content.orderId,
        product: content.product,
        quantity: content.quantity,
      });
    });
  }

  async sendInventoryReserveResponse(
    message: InventoryReserveOutboxMessageEntity,
  ) {
    this.channel.sendToQueue(
      INVENTORY_RESERVE_RESP,
      Buffer.from(JSON.stringify(message.toJSON())),
    );
  }
}
