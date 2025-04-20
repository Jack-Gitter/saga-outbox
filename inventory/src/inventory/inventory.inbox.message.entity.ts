import { Entity, Column } from 'typeorm';

@Entity('InventoryInboxMessages')
export class InventoryInboxMessage {
  constructor(id: number) {
    this.id = id;
  }

  @Column({ type: 'int', nullable: false })
  id: number;
}
