import { ISagaOrchestrator } from 'src/saga/ISagaOrchestrator';
import { ISagaStep } from 'src/saga/ISagaStep';
export class OrdersSagaOrchestrator implements ISagaOrchestrator {
  constructor(private steps: ISagaStep[]) {}

  begin(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
