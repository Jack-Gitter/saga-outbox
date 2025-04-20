import { Injectable } from '@nestjs/common';
import { Channel, Message } from 'amqplib-as-promised/lib';
import { OrdersOutboxMessage } from '../orders.outbox.entity';
import { INVENTORY_RESERVE } from '../orders.symbols';
import {
  INVENTORY_REMOVE,
  INVENTORY_RESERVE_COMPENSATE,
  SHIPPING_VALIDATION,
} from './rmq.types';
import { MessageResponse } from '../orders.types';

@Injectable()
export class RMQService {
  constructor(private channel: Channel) {}

  async sendInventoryReserveMessage(mes: OrdersOutboxMessage) {
    console.debug(`Sending inventory reserve message!`);
    await this.channel.sendToQueue(
      INVENTORY_RESERVE,
      Buffer.from(JSON.stringify(mes.toJSON())),
    );
  }

  async sendCompensateInventoryReserveMessage(mes: OrdersOutboxMessage) {
    console.debug(`Sending inventory reserve compensation`);
    await this.channel.sendToQueue(
      INVENTORY_RESERVE_COMPENSATE,
      Buffer.from(JSON.stringify(mes.toJSON())),
    );
  }

  async registerQueueResponseHandler(
    queue: string,
    fun: (messageResponse: MessageResponse) => unknown,
  ) {
    await this.channel.consume(queue, async (mes: Message) => {
      const contents = JSON.parse(mes.content.toString());
      const messageResponse: MessageResponse = {
        successful: contents.successful,
        orderId: contents.orderId,
      };
      await fun(messageResponse);
    });
  }

  async sendShippingValidationMessage(mes: OrdersOutboxMessage) {
    console.debug(`Sending shipping validation message!`);
    await this.channel.sendToQueue(
      SHIPPING_VALIDATION,
      Buffer.from(JSON.stringify(mes.toJSON())),
    );
  }

  async sendInventoryRemoveMessage(mes: OrdersOutboxMessage) {
    console.debug(`Sending shipping validation message!`);
    await this.channel.sendToQueue(
      INVENTORY_REMOVE,
      Buffer.from(JSON.stringify(mes.toJSON())),
    );
  }
}
