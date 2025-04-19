import { Injectable } from '@nestjs/common';
import { ISagaOrchestrator } from 'src/saga/ISagaOrchestrator';
import { ISagaStep } from 'src/saga/ISagaStep';

@Injectable()
export class OrdersSagaOrchestrator implements ISagaOrchestrator {
  constructor(private steps: ISagaStep[]) {}
  currentStep = 0;

  async invokeNext(): Promise<void> {
    await this.steps[this.currentStep].invoke();
  }
  async compensate(): Promise<void> {
    for (let i = 0; i < this.currentStep; i++) {
      await this.steps[i].rollback();
    }
  }
}
