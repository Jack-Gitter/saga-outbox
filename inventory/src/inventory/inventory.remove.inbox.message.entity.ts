import { Entity, Column } from 'typeorm';

@Entity('InventoryReserveInboxMessage')
export class InventoryRemoveInboxMessageEntity {
  constructor(id: number) {
    this.id = id;
  }

  @Column({ type: 'int', nullable: false })
  id: number;
}
