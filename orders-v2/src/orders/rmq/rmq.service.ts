import { Injectable } from '@nestjs/common';
import { Channel, Message } from 'amqplib-as-promised/lib';
import { OrdersOutboxMessage } from '../orders.outbox.entity';
import { INVENTORY_RESERVE } from '../orders.symbols';
import { INVENTORY_RESERVE_RESPONSE, SHIPPING_VALIDATION } from './rmq.types';
import { MessageResponse } from '../orders.types';

@Injectable()
export class RMQService {
  constructor(private channel: Channel) {}

  sendInventoryReserveMessage(mes: OrdersOutboxMessage) {
    this.channel.sendToQueue(
      INVENTORY_RESERVE,
      Buffer.from(JSON.stringify(mes.toJSON())),
    );
  }

  async registerInventoryReserveMessageResponseHandler(
    fun: (messageResponse: MessageResponse) => unknown,
  ) {
    this.channel.consume(INVENTORY_RESERVE_RESPONSE, async (mes: Message) => {
      const contents = JSON.parse(mes.content.toString());
      const messageResponse: MessageResponse = {
        successful: contents.successful,
        orderId: contents.orderId,
      };
      await fun(messageResponse);
    });
  }

  sendShippingValidationMessage(mes: OrdersOutboxMessage) {
    this.channel.sendToQueue(
      SHIPPING_VALIDATION,
      Buffer.from(JSON.stringify(mes.toJSON())),
    );
  }
}
