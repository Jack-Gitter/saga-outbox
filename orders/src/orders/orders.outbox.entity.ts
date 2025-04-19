import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('OrdersOutboxMessages')
export class OrdersOutboxMessage {
  constructor(product: number, quantity: number) {
    this.product = product;
    this.quantity = quantity;
  }
  @PrimaryGeneratedColumn()
  id: number;

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
