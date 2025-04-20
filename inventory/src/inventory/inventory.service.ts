import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InventoryReserveMessage } from './rmq/rmq.types';
import { InventoryInboxMessage } from './inventory.inbox.message.entity';
import { InventoryReservation } from './inventory.entity';
import { InventoryOutboxMessage } from './inventory.outbox.message.entity';

@Injectable()
export class InventoryService {
  constructor(private dataSource: DataSource) {}

  async handleInventoryReserveMessage(message: InventoryReserveMessage) {
    await this.dataSource.transaction(async (entityManager) => {
      const inboxRepo = entityManager.getRepository(InventoryInboxMessage);
      const existingMessage = inboxRepo.findOneBy({ id: message.orderId });
      if (existingMessage) {
        console.debug(`already handled this message!`);
        return;
      }
      const inboxMessage = new InventoryInboxMessage(message.orderId);
      await inboxRepo.save(inboxMessage);

      const inventoryReservation = new InventoryReservation(
        message.orderId,
        message.product,
        message.quantity,
      );

      const reservationRepo = entityManager.getRepository(InventoryReservation);
      const res = await reservationRepo.insert(inventoryReservation);
      const successful = res.identifiers.length > 0;

      // TODO
      const outboxRepo = entityManager.getRepository(InventoryOutboxMessage);
      const outboxMessage = new InventoryOutboxMessage(
        message.orderId,
        successful,
      );
      await outboxRepo.save(outboxMessage);
    });
  }
}
