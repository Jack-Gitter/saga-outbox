import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { RMQModule } from './rmq/rmq.module';

@Module({
  imports: [RMQModule],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
