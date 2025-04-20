import { Controller } from '@nestjs/common';
import { RMQService } from './rmq/rmq.service';
import { InventoryService } from './inventory.service';

@Controller()
export class InventoryController {
  constructor(
    private rmqService: RMQService,
    private inventoryService: InventoryService,
  ) {}
  onApplicationBoostrap() {
    await this.rmqService.registerInventoryReserveMessageHandler(
      this.inventoryService.handleInventoryReserveMessage.bind(
        this.inventoryService,
      ),
    );
    // register handlers for incomming inventory reservation and deletion
    // register the poller to poll outbox messages
  }
}
