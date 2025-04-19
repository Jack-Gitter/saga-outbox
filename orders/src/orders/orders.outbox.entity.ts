import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrdersOutgoingMessage } from './orders.types';

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

  public toJSON(): OrdersOutgoingMessage {
    return {
      orderId: this.orderId,
      product: this.product,
      quantity: this.quantity,
    };
  }
}
