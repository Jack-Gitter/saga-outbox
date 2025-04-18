import { ISagaOrchestrator } from 'src/saga/ISagaOrchestrator';
import { ISagaStep } from 'src/saga/ISagaStep';
export class OrdersSagaOrchestrator implements ISagaOrchestrator {
  constructor(private steps: ISagaStep[]) {}

  async begin(): Promise<void> {
    const succeededSteps: ISagaStep[] = [];
    try {
      for (const step of this.steps) {
        await step.invoke();
        succeededSteps.push(step);
      }
    } catch {
      await Promise.all(
        succeededSteps.map(async (step) => await step.rollback()),
      );
    }
  }
}
