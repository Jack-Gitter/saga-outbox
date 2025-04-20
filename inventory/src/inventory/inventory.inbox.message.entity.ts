import { Entity, Column } from 'typeorm';

@Entity('InventoryInboxMessages')
export class InventoryInboxMessage {
  constructor() {}

  @Column({ type: 'int', nullable: false })
  id: number;
}
