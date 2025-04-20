import { Column, Entity } from 'typeorm';

@Entity('InventoryOutboxMessages')
export class InventoryOutboxMessage {
  @Column({ primary: true, type: 'int', nullable: false })
  orderId: number;

  @Column({ type: 'boolean', nullable: false })
  successful: boolean;
}
