import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ISagaOrchestrator } from 'src/saga/ISagaOrchestrator';
import { ISagaStep } from 'src/saga/ISagaStep';

@Injectable()
export class OrdersSagaOrchestrator implements ISagaOrchestrator {
  constructor(private steps: ISagaStep[]) {}
  mostRecentInvokedStep = -1;

  async invokeStep(stepNumber: number): Promise<void> {
    if (stepNumber >= this.steps.length) {
      throw new InternalServerErrorException(
        `No more steps of saga to invoke!`,
      );
    }
    this.mostRecentInvokedStep = stepNumber;
    await this.steps[stepNumber].invoke();
  }

  async compensate(): Promise<void> {
    for (let i = 0; i < this.currentStep; i++) {
      await this.steps[i].rollback();
    }
  }
}
