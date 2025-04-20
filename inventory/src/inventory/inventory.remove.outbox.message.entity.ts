import { Column, Entity } from 'typeorm';

@Entity('InventoryRemoveOutboxMessage')
export class InventoryRemoveOutboxMessageEntity {
  constructor(orderId: number, successful: boolean) {
    this.orderId = orderId;
    this.successful = successful;
  }
  @Column({ primary: true, type: 'int', nullable: false })
  orderId: number;

  @Column({ type: 'boolean', nullable: false })
  successful: boolean;

  toJSON() {
    return {
      orderId: this.orderId,
      successful: this.successful,
    };
  }
}
