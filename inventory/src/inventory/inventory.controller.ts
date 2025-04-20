import { Controller } from '@nestjs/common';

@Controller()
export class InventoryController {
  // here, we want to use RMQService in onApplicationBoostrap to set up message handlers for incomming messages
  // all the real work is done by the inventory service
  //

  onApplicationBoostrap() {}
}
