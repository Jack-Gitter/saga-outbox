import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('OrdersOutboxMessages')
export class OrdersOutboxMessage {
  constructor(product: number, quantity: number, orderId: number) {
    this.product = product;
    this.quantity = quantity;
    this.orderId = orderId;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  orderId: number;

  @Column({ type: 'int', nullable: false })
  product: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  public toJSON() {
    return {
      id: this.id,
      product: this.product,
      quantity: this.quantity,
    };
  }
}
