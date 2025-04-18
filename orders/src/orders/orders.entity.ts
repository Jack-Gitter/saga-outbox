import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { STATUS } from './orders.enums';

@Entity()
export class Order {
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

  @Column({ type: 'enum', nullable: false, default: STATUS.PENDING })
  status: STATUS;
}
