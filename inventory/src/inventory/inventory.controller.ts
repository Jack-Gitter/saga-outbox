import { Controller } from '@nestjs/common';
import { RMQService } from './rmq/rmq.service';
import { InventoryService } from './inventory.service';

@Controller()
export class InventoryController {
  constructor(
    private rmqService: RMQService,
    private inventoryService: InventoryService,
  ) {}
  async onApplicationBootstrap() {
    await this.inventoryService.pollOutbox();
    await this.rmqService.registerInventoryReserveMessageHandler(
      this.inventoryService.handleInventoryReserveMessage.bind(
        this.inventoryService,
      ),
    );
  }
}
