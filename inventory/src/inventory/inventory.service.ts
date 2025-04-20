import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InventoryReserveMessage } from './rmq/rmq.types';
import { InventoryInboxMessage } from './inventory.inbox.message.entity';

@Injectable()
export class InventoryService {
  constructor(private dataSource: DataSource) {}

  async handleInventoryReserveMessage(message: InventoryReserveMessage) {
    this.dataSource.transaction((entityManager) => {
      const inboxRepo = entityManager.getRepository(InventoryInboxMessage);
      const existingMessage = inboxRepo.findOneBy({ id: message.orderId });
      if (existingMessage) {
        console.debug(`already handled this message!`);
        return;
      }
      const inboxMessage = new InventoryInboxMessage(message.orderId);
      await inboxRepo.save(inboxMessage);
    });
  }
}
