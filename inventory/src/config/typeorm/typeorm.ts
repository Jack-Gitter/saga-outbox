import { InventoryInboxMessage } from 'src/inventory/inventory.inbox.message.entity';
import { DataSource } from 'typeorm';

export const dataSource: DataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 1001,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [InventoryInboxMessage],
  migrations: [],
});
