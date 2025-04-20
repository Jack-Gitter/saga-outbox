import { Injectable } from '@nestjs/common';
import { Channel } from 'amqplib-as-promised/lib';
import {
  SHIPPING_VALIDATION_RESPONSE,
  ShippingValidationResponse,
} from './rmq.types';

@Injectable()
export class RMQService {
  constructor(private channel: Channel) {}
  async sendShippingValidationResponse(mes: ShippingValidationResponse) {
    await this.channel.sendToQueue(
      SHIPPING_VALIDATION_RESPONSE,
      Buffer.from(JSON.stringify(mes)),
    );
  }
}
