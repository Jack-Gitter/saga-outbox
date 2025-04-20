import { ISagaStep } from 'src/saga/ISagaStep';
import { Order } from '../orders.entity';
import { DataSource } from 'typeorm';
import { STATUS } from '../orders.enums';

export class OrderConfirmStep implements ISagaStep {
  constructor(
    private orderId: number,
    private dataSource: DataSource,
  ) {}

  async invoke(): Promise<void> {
    console.debug('invoking inventory delete step!');
    await this.dataSource.transaction(async (entityManager) => {
      const repo = entityManager.getRepository(Order);
      const order = await repo.findOne({ where: { id: this.orderId } });
      order.status = STATUS.CONFIRMED;
      await repo.save(order);
    });
  }
  rollback(): void {
    console.debug('invoking order confirm step rollback!');
    console.debug('nothing to do, the last step in the saga');
  }
}
