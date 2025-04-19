import { Order } from '../../orders/orders.entity';
import { OrdersOutboxMessage } from '../../orders/orders.outbox.entity';
import { DataSource } from 'typeorm';
import { Init1744937663214 } from './migrations/1744937663214-Init';
import { Init1745082901532 } from './migrations/1745082901532-Init';

export const dataSource: DataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 1000,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [Order, OrdersOutboxMessage],
  migrations: [Init1744937663214, Init1745082901532],
});
