import { ISagaStep } from 'src/saga/ISagaStep';
export declare class InventoryStep implements ISagaStep {
    invoke(): Promise<void>;
    rollback(): Promise<void>;
}
