import { Injectable } from '@nestjs/common';
import { ShippingValidationMessage } from './rmq/rmq.types';
import { RMQService } from './rmq/rmq.service';

@Injectable()
export class ShippingService {
  constructor(private rmqService: RMQService) {}
  async handleShippingValidationMessage(mes: ShippingValidationMessage) {
    if (process.env.ACCEPT_SHIPPING ?? true) {
      console.debug(`Shipping validation accepted`);
      await this.rmqService.sendShippingValidationResponse({
        orderId: mes.orderId,
        successful: true,
      });
    } else {
      console.debug(`Shipping validation rejected`);
      await this.rmqService.sendShippingValidationResponse({
        orderId: mes.orderId,
        successful: false,
      });
    }
  }
}
