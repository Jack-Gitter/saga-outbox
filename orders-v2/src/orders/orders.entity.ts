import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { STATUS } from './orders.enums';

@Entity('Orders')
export class Order {
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

  @Column({
    type: 'enum',
    enum: STATUS,
    nullable: false,
    default: STATUS.PENDING,
  })
  status: STATUS;

  toJSONMessage() {
    return {
      orderId: this.id,
      product: this.product,
      quantity: this.quantity,
    };
  }
}
