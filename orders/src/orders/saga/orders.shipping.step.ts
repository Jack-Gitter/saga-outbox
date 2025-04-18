import { ISagaStep } from 'src/saga/ISagaStep';

export class ShippingStep implements ISagaStep {
  invoke(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  rollback(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
