import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib-as-promised';

Injectable();
export class RabbitMQService {
  constructor(
    private channel: amqp.Channel,
    private inventory_queue: string,
    private shipping_queue: string,
  ) {}

  async sendInventoryCheckMessage(product: number, quantity: number) {
    await this.channel.sendToQueue(
      this.inventory_queue,
      Buffer.from(JSON.stringify({ product, quantity })),
    );
  }

  sendShippingMessage(product: number, quantity: number) {
    this.channel.sendToQueue(
      this.shipping_queue,
      Buffer.from(JSON.stringify({ product, quantity })),
    );
  }
}
