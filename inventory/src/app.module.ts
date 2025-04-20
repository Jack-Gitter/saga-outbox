import { Module } from '@nestjs/common';
import { InventoryModule } from './inventory/inventory.module';
import { RMQModule } from './inventory/rmq/rmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryReservation } from './inventory/inventory.entity';
import { InventoryReserveInboxMessageEntity } from './inventory/inventory.reserve.inbox.message.entity';
import { InventoryRemoveInboxMessageEntity } from './inventory/inventory.remove.inbox.message.entity';
import { InventoryRemoveOutboxMessageEntity } from './inventory/inventory.remove.outbox.message.entity';
import { InventoryReserveOutboxMessageEntity } from './inventory/inventory.reserve.outbox.message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
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
    }),
    InventoryModule,
    RMQModule,
  ],
})
export class AppModule {}
