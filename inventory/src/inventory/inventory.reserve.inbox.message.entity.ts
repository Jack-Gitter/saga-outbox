import { Entity, Column } from 'typeorm';

@Entity('InventoryReserveInboxMessage')
export class InventoryReserveInboxMessage {
  constructor(id: number) {
    this.id = id;
  }

  @Column({ type: 'int', nullable: false })
  id: number;
}
