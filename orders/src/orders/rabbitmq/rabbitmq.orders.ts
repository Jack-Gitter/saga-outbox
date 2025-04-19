import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib-as-promised';
import { OrdersOutboxMessage } from '../orders.outbox.entity';

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

  async sendInventoryReserveMessage(message: OrdersOutboxMessage) {
    await this.channel.sendToQueue(
      this.inventory_reserve_queue,
      Buffer.from(JSON.stringify(message.toJSON())),
      {
        replyTo: this.inventory_reserve_queue_resp,
      },
    );
    return new Promise((res) => {
      this.channel.consume(
        this.inventory_reserve_queue_resp,
        (mes: amqp.Message) => {
          res(this.handleResponse(mes));
        },
      );
    });
  }

  async sendInventoryReserveRollbackMessage(message: OrdersOutboxMessage) {
    await this.channel.sendToQueue(
      this.inventory_reserve_rollback_queue,
      Buffer.from(JSON.stringify(message.toJSON())),
      {
        replyTo: this.inventory_reserve_rollback_queue_resp,
      },
    );
    return new Promise((res) => {
      this.channel.consume(
        this.inventory_reserve_rollback_queue_resp,
        (mes: amqp.Message) => {
          res(this.handleResponse(mes));
        },
      );
    });
  }

  async sendShippingMessage(message: OrdersOutboxMessage) {
    await this.channel.sendToQueue(
      this.shipping_queue,
      Buffer.from(JSON.stringify(message.toJSON())),
      {
        replyTo: this.shipping_queue_resp,
      },
    );
    return new Promise((res) => {
      this.channel.consume(this.shipping_queue_resp, (mes: amqp.Message) => {
        res(this.handleResponse(mes));
      });
    });
  }

  async sendShippingRollbackMessage(message: OrdersOutboxMessage) {
    await this.channel.sendToQueue(
      this.shipping_rollback_queue,
      Buffer.from(JSON.stringify(message.toJSON())),
      {
        replyTo: this.shipping_rollback_queue_resp,
      },
    );
    return new Promise((res) => {
      this.channel.consume(
        this.shipping_rollback_queue_resp,
        (mes: amqp.Message) => {
          res(this.handleResponse(mes));
        },
      );
    });
  }

  async sendInventoryDeleteMessage(message: OrdersOutboxMessage) {
    await this.channel.sendToQueue(
      this.inventory_delete_queue,
      Buffer.from(JSON.stringify(message.toJSON())),
      {
        replyTo: this.inventory_delete_queue_resp,
      },
    );
    return new Promise((res) => {
      this.channel.consume(
        this.inventory_delete_queue_resp,
        (mes: amqp.Message) => {
          res(this.handleResponse(mes));
        },
      );
    });
  }

  private handleResponse(mes: amqp.Message) {
    const content = JSON.parse(mes.content.toString());
    if (content.success !== true) {
      throw new Error(content.message);
    }
    console.debug(`step succeeded! ${content.message}`);
  }
}
