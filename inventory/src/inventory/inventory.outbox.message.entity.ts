import { Column, Entity } from 'typeorm';

@Entity('InventoryOutboxMessages')
export class InventoryOutboxMessage {
  constructor(orderId: number, successful: boolean) {
    this.orderId = orderId;
    this.successful = successful;
  }
  @Column({ primary: true, type: 'int', nullable: false })
  orderId: number;

  @Column({ type: 'boolean', nullable: false })
  successful: boolean;
}
