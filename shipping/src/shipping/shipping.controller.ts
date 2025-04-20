import { Controller } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller()
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  onApplicationBootstrap() {}
}
