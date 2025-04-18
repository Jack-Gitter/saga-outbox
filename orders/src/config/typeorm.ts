import { Order } from '../orders/orders.entity';
import { OrdersOutboxMessage } from '../orders/orders.outbox.entity';
import { DataSource } from 'typeorm';

export const dataSource: DataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 1000,
  username: 'postgres',
  password: 'postgres',
  database: 'orders',
  entities: [Order, OrdersOutboxMessage],
});
