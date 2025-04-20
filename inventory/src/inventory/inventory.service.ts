import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InventoryReserveMessage } from './rmq/rmq.types';
import { InventoryReserveInboxMessage } from './inventory.reserve.inbox.message.entity';
import { InventoryReservation } from './inventory.entity';
import { InventoryReserveOutboxMessage } from './inventory.reserve.outbox.message.entity';
import { RMQService } from './rmq/rmq.service';

@Injectable()
export class InventoryService {
  constructor(
    private dataSource: DataSource,
    private rmqService: RMQService,
  ) {}

  async handleInventoryReserveMessage(message: InventoryReserveMessage) {
    await this.dataSource.transaction(async (entityManager) => {
      const inboxRepo = entityManager.getRepository(InventoryReserveInboxMessage);
      const existingMessage = inboxRepo.findOneBy({ id: message.orderId });
      if (existingMessage) {
        console.debug(`already handled this message!`);
        return;
      }
      const inboxMessage = new InventoryReserveInboxMessage(message.orderId);
      await inboxRepo.save(inboxMessage);

      const inventoryReservation = new InventoryReservation(
        message.orderId,
        message.product,
        message.quantity,
      );

      const reservationRepo = entityManager.getRepository(InventoryReservation);
      const res = await reservationRepo.insert(inventoryReservation);
      const successful = res.identifiers.length > 0;

      const outboxRepo = entityManager.getRepository(InventoryReserveOutboxMessage);
      const outboxMessage = new InventoryReserveOutboxMessage(
        message.orderId,
        successful,
      );
      await outboxRepo.save(outboxMessage);
    });
  }

  async pollOutbox() {
    const outboxRepo = this.dataSource.getRepository(InventoryReserveOutboxMessage);
    const messages = await outboxRepo.find();

    await Promise.all(messages.map(message) => {
        return this.rmqService.sendInventoryReserveResponse()
    });

    // create messages and send them
  }
}
