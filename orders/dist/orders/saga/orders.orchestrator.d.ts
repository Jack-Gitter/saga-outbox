import { ISagaOrchestrator } from 'src/saga/ISagaOrchestrator';
import { ISagaStep } from 'src/saga/ISagaStep';
export declare class OrdersSagaOrchestrator implements ISagaOrchestrator {
    private steps;
    constructor(steps: ISagaStep[]);
    begin(): Promise<void>;
}
