import { InventoryReservation } from 'src/inventory/inventory.entity';
import { InventoryRemoveInboxMessageEntity } from 'src/inventory/inventory.remove.inbox.message.entity';
import { InventoryRemoveOutboxMessageEntity } from 'src/inventory/inventory.remove.outbox.message.entity';
import { InventoryReserveInboxMessageEntity } from 'src/inventory/inventory.reserve.inbox.message.entity';
import { InventoryReserveOutboxMessageEntity } from 'src/inventory/inventory.reserve.outbox.message.entity';
import { DataSource } from 'typeorm';

export const dataSource: DataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 1001,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [
    InventoryReservation,
    InventoryReserveInboxMessageEntity,
    InventoryRemoveInboxMessageEntity,
    InventoryRemoveOutboxMessageEntity,
    InventoryReserveOutboxMessageEntity,
  ],
  migrations: [],
});
