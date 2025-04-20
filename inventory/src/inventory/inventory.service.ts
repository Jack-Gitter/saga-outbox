import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  InventoryRemoveInboxMessage,
  InventoryReserveInboxMessage,
} from './rmq/rmq.types';
import { InventoryReserveInboxMessageEntity } from './inventory.reserve.inbox.message.entity';
import { InventoryReservation } from './inventory.entity';
import { InventoryReserveOutboxMessageEntity } from './inventory.reserve.outbox.message.entity';
import { RMQService } from './rmq/rmq.service';
import { InventoryRemoveInboxMessageEntity } from './inventory.remove.inbox.message.entity';
import { InventoryRemoveOutboxMessageEntity } from './inventory.remove.outbox.message.entity';

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

  async handleInventoryRemoveMessage(message: InventoryRemoveInboxMessage) {
    await this.dataSource.transaction(async (entityManager) => {
      const inboxMessage = new InventoryRemoveInboxMessageEntity(
        message.orderId,
      );
      const inventoryRemoveInboxRepo = entityManager.getRepository(
        InventoryRemoveInboxMessageEntity,
      );
      await inventoryRemoveInboxRepo.save(inboxMessage);
      const inventoryReservationRepo =
        entityManager.getRepository(InventoryReservation);
      const reservation = await inventoryReservationRepo.findOneBy({
        id: message.orderId,
      });
      const res = await inventoryReservationRepo.delete(reservation);
      const successful = res.affected > 0;
      const outboxRepo = entityManager.getRepository(
        InventoryReserveOutboxMessageEntity,
      );
      const outboxMessage = new InventoryRemoveOutboxMessageEntity(
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
    const removeOutboxRepo = this.dataSource.getRepository(
      InventoryRemoveOutboxMessageEntity,
    );
    const reserveMessages = await reserveOutboxRepo.find();
    const removeMessages = await removeOutboxRepo.find();

    await Promise.all(
      reserveMessages.map(async (message) => {
        return await this.rmqService.sendInventoryReserveResponse(message);
      }),
    );

    await Promise.all(
      removeMessages.map(async (message) => {
        return await this.rmqService.sendInventoryReserveResponse(message);
      }),
    );

    await reserveOutboxRepo.remove(reserveMessages);
    await removeOutboxRepo.remove(removeMessages);
  }
}
