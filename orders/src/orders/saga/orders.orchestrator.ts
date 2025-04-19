import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ISagaOrchestrator } from 'src/saga/ISagaOrchestrator';
import { ISagaStep } from 'src/saga/ISagaStep';
import { ORDERS_SAGA_STEP } from './orders.saga.enum';

@Injectable()
export class OrdersSagaOrchestrator implements ISagaOrchestrator {
  constructor(private steps: Map<ORDERS_SAGA_STEP, ISagaStep>) {}
  invokedSteps: ORDERS_SAGA_STEP[] = [];

  async invokeStep(step: ORDERS_SAGA_STEP): Promise<void> {
    const currentStep = this.steps.get(step);
    if (!currentStep) {
      throw new InternalServerErrorException(`Invalid Step!`);
    }
    currentStep.invoke();
    this.invokedSteps.push(step);
  }

  async compensate(): Promise<void> {
    const executedSteps = this.invokedSteps.map((invoked) => {
      return this.steps.get(invoked);
    });
    executedSteps.forEach((step) => {
      step.rollback();
    });
  }
}
