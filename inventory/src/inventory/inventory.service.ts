import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InventoryReserveMessage } from './rmq/rmq.types';
import { InventoryInboxMessage } from './inventory.inbox.message.entity';

@Injectable()
export class InventoryService {
  constructor(private dataSource: DataSource) {}

  async handleInventoryReserveMessage(message: InventoryReserveMessage) {
    const inboxRepo = this.dataSource.getRepository(InventoryInboxMessage);
    const inboxMessage = new InventoryInboxMessage(message.orderId);
  }
}
