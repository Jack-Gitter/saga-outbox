import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib-as-promised';
import { OrdersOutboxMessage } from '../orders.outbox.entity';
import { ORDERS_SAGA_STEP } from '../saga/orders.saga.enum';

Injectable();
export class RabbitMQService {
  constructor(
    private channel: amqp.Channel,
    private inventory_reserve_queue: string,
    private shipping_queue: string,
    private inventory_reserve_queue_resp: string,
    private shipping_queue_resp: string,
    private inventory_delete_queue: string,
    private inventory_delete_queue_resp: string,
    private inventory_reserve_rollback_queue: string,
    private inventory_reserve_rollback_queue_resp: string,
    private shipping_rollback_queue: string,
    private shipping_rollback_queue_resp: string,
  ) {}

  sendInventoryReserveMessage(message: OrdersOutboxMessage) {
    this.channel.sendToQueue(
      this.inventory_reserve_queue,
      Buffer.from(JSON.stringify(message.toJSON())),
      {
        replyTo: this.inventory_reserve_queue_resp,
      },
    );
  }

  registerInventoryReserveMessageResponseListener(
    func: (message: amqp.Message) => void,
  ) {
    this.channel.consume(this.inventory_reserve_queue_resp, func);
  }

  sendInventoryReserveRollbackMessage(message: OrdersOutboxMessage) {
    this.channel.sendToQueue(
      this.inventory_reserve_rollback_queue,
      Buffer.from(JSON.stringify(message.toJSON())),
      {
        replyTo: this.inventory_reserve_rollback_queue_resp,
      },
    );
  }

  async registerInventoryReserveRollbackMessageListener() {}

  async sendShippingMessage(message: OrdersOutboxMessage) {
    await this.channel.sendToQueue(
      this.shipping_queue,
      Buffer.from(JSON.stringify(message.toJSON())),
      {
        replyTo: this.shipping_queue_resp,
      },
    );
  }

  async registerSendShippingResponseHandler(
    func: (message: amqp.Message) => void,
  ) {
    this.channel.consume(this.shipping_queue_resp, func);
  }

  sendShippingRollbackMessage(message: OrdersOutboxMessage) {
    this.channel.sendToQueue(
      this.shipping_rollback_queue,
      Buffer.from(JSON.stringify(message.toJSON())),
      {
        replyTo: this.shipping_rollback_queue_resp,
      },
    );
  }

  async registerSendShippingRollbackMessageListener() {
    // call the callback function upon receipt of the message!
  }

  sendInventoryDeleteMessage(message: OrdersOutboxMessage) {
    this.channel.sendToQueue(
      this.inventory_delete_queue,
      Buffer.from(JSON.stringify(message.toJSON())),
      {
        replyTo: this.inventory_delete_queue_resp,
      },
    );
  }

  async registerSendInventoryDeleteMessageListener(
    func: (message: amqp.Message) => void,
  ) {
    this.channel.consume(this.inventory_delete_queue_resp, func);
    // call the callback function upon receipt of the message!
  }

  private handleResponse(mes: amqp.Message) {
    const content = JSON.parse(mes.content.toString());
    if (content.success !== true) {
      throw new Error(content.message);
    }
    console.debug(`step succeeded! ${content.message}`);
  }
}
