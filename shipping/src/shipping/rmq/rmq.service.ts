import { Injectable } from '@nestjs/common';
import { Channel, Message } from 'amqplib-as-promised/lib';
import {
  SHIPPING_VALIDATION,
  SHIPPING_VALIDATION_RESPONSE,
  ShippingValidationMessage,
  ShippingValidationResponse,
} from './rmq.types';

@Injectable()
export class RMQService {
  constructor(private channel: Channel) {}
  async sendShippingValidationResponse(mes: ShippingValidationResponse) {
    console.debug(`Sending shipping validation response!`);
    console.debug(mes);
    await this.channel.sendToQueue(
      SHIPPING_VALIDATION_RESPONSE,
      Buffer.from(JSON.stringify(mes)),
    );
  }

  async registerShippingValidationMessageHandler(
    fun: (mes: ShippingValidationMessage) => Promise<void>,
  ) {
    await this.channel.consume(
      SHIPPING_VALIDATION,
      async (mes: Message) => {
        console.debug(`Recieved shipping validation message!`);
        const content = JSON.parse(mes.content.toString());
        await fun(content);
        this.channel.ack(mes);
      },
      {
        noAck: false,
      },
    );
  }
}
