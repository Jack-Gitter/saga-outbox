import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ISagaOrchestrator } from 'src/saga/ISagaOrchestrator';
import { ISagaStep } from 'src/saga/ISagaStep';
import { ORDERS_SAGA_STEP } from './orders.saga.enum';

@Injectable()
export class OrdersSagaOrchestrator
  implements ISagaOrchestrator<ORDERS_SAGA_STEP>
{
  constructor(private steps: Map<ORDERS_SAGA_STEP, ISagaStep>) {}

  async invokeStep(step: ORDERS_SAGA_STEP): Promise<void> {
    const currentStep = this.steps.get(step);
    if (!currentStep) {
      throw new InternalServerErrorException(`Invalid Step!`);
    }
    currentStep.invoke();
  }

  compensate(step: ORDERS_SAGA_STEP): void {
    const currentStep = this.steps.get(step);
    if (!currentStep) {
      throw new InternalServerErrorException(`Invalid Step!`);
    }
    currentStep.rollback();
  }
}
