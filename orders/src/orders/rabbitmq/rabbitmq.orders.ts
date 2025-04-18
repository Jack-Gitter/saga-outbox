import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib-as-promised';

Injectable();
export class RabbitMQOrdersService {
  constructor(
    private channel: amqp.Channel,
    private inventory_channel: string,
    private shipping_channel: string,
  ) {}

  sendInventoryCheckMessage(product: number, quantity: number) {
    this.channel.sendToQueue(
      this.inventory_channel,
      Buffer.from(JSON.stringify({ product, quantity })),
    );
  }

  sendShippingMessage(product: number, quantity: number) {
    this.channel.sendToQueue(
      this.shipping_channel,
      Buffer.from(JSON.stringify({ product, quantity })),
    );
  }
}
