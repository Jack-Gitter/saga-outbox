import { Injectable } from '@nestjs/common';
import { ShippingValidationMessage } from './rmq/rmq.types';
import { RMQService } from './rmq/rmq.service';

@Injectable()
export class ShippingService {
  constructor(private rmqService: RMQService) {}
  async handleShippingValidationMessage(mes: ShippingValidationMessage) {
    if (process.env.ACCEPT_SHIPPING ?? true) {
      await this.rmqService.sendShippingValidationResponse(true);
    } else {
      await this.rmqService.sendShippingValidationResponse(false);
    }
  }
}
