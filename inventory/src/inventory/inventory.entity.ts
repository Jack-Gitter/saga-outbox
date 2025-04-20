import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InventoryReservation {
  constructor(orderId: number, product: number, quantity: number) {
    this.orderId = orderId;
    this.product = product;
    this.quantity = quantity;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  orderId: number;

  @Column({ type: 'int', nullable: false })
  product: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;
}
