import { Entity, Column } from 'typeorm';

@Entity('InventoryRemoveInboxMessage')
export class InventoryRemoveInboxMessageEntity {
  constructor(id: number) {
    this.id = id;
  }

  @Column({ primary: true, type: 'int', nullable: false })
  id: number;
}
