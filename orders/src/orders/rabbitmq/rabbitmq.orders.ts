import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib-as-promised';

Injectable();
export class RabbitMQService {
  constructor(
    private channel: amqp.Channel,
    private inventory_queue: string,
    private shipping_queue: string,
    private inventory_queue_resp: string,
    private shipping_queue_resp: string,
  ) {}

  async sendInventoryReserveMessage(product: number, quantity: number) {
    await this.channel.sendToQueue(
      this.inventory_queue,
      Buffer.from(JSON.stringify({ product, quantity })),
    );
    await this.channel.consume(this.inventory_queue_resp, this.handleResponse);
  }

  async sendShippingMessage(product: number, quantity: number) {
    await this.channel.sendToQueue(
      this.shipping_queue,
      Buffer.from(JSON.stringify({ product, quantity })),
    );
    await this.channel.consume(this.shipping_queue_resp, this.handleResponse);
  }

  private handleResponse(mes: amqp.Message) {
    const content = JSON.parse(mes.content.toString());
    if (content.success !== true) {
      throw new Error(content.message);
    }
  }
}
