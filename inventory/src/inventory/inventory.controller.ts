import { Controller } from '@nestjs/common';

@Controller()
export class InventoryController {
  onApplicationBoostrap() {
    // register handlers for incomming inventory reservation and deletion
    // register the poller to poll outbox messages
  }
}
