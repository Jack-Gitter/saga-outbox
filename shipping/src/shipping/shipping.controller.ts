import { Controller } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { RMQService } from './rmq/rmq.service';

@Controller()
export class ShippingController {
  constructor(
    private shippingService: ShippingService,
    private rmqService: RMQService,
  ) {}

  onApplicationBootstrap() {
    this.rmqService.registerShippingValidationMessageHandler(
      this.shippingService.handleShippingValidationMessage.bind(
        this.shippingService,
      ),
    );
  }
}
