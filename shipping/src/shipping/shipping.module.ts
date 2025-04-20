import { Module } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';
import { RMQModule } from './rmq/rmq.module';

@Module({
  imports: [RMQModule],
  controllers: [ShippingController],
  providers: [ShippingService],
})
export class ShippingModule {}
