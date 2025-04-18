import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('OrdersOutboxMessages')
export class OrdersOutboxMessage {
  constructor(product: number, quantity: number) {
    this.product = product;
    this.quantity = quantity;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'number', nullable: false })
  product: number;

  @Column({ type: 'number', nullable: false })
  quantity: number;
}
