import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InventoryReserveInboxMessage } from './rmq/rmq.types';
import { InventoryReserveInboxMessageEntity } from './inventory.reserve.inbox.message.entity';
import { InventoryReservation } from './inventory.entity';
import { InventoryReserveOutboxMessageEntity } from './inventory.reserve.outbox.message.entity';
import { RMQService } from './rmq/rmq.service';

@Injectable()
export class InventoryService {
  constructor(
    private dataSource: DataSource,
    private rmqService: RMQService,
  ) {}

  async handleInventoryReserveMessage(message: InventoryReserveInboxMessage) {
    await this.dataSource.transaction(async (entityManager) => {
      const inboxRepo = entityManager.getRepository(
        InventoryReserveInboxMessageEntity,
      );
      const existingMessage = inboxRepo.findOneBy({ id: message.orderId });
      if (existingMessage) {
        console.debug(`already handled this message!`);
        return;
      }
      const inboxMessage = new InventoryReserveInboxMessageEntity(
        message.orderId,
      );
      await inboxRepo.save(inboxMessage);

      const inventoryReservation = new InventoryReservation(
        message.orderId,
        message.product,
        message.quantity,
      );

      const reservationRepo = entityManager.getRepository(InventoryReservation);
      const res = await reservationRepo.insert(inventoryReservation);
      const successful = res.identifiers.length > 0;

      const outboxRepo = entityManager.getRepository(
        InventoryReserveOutboxMessageEntity,
      );
      const outboxMessage = new InventoryReserveOutboxMessageEntity(
        message.orderId,
        successful,
      );
      await outboxRepo.save(outboxMessage);
    });
  }

  async pollOutbox() {
    const reserveOutboxRepo = this.dataSource.getRepository(
      InventoryReserveOutboxMessageEntity,
    );
    const messages = await reserveOutboxRepo.find();

    await Promise.all(
      messages.map(async (message) => {
        return await this.rmqService.sendInventoryReserveResponse(message);
      }),
    );

    // create messages and send them
  }
}
