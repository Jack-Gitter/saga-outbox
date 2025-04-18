import { ISagaStep } from 'src/saga/ISagaStep';
export declare class ShippingStep implements ISagaStep {
    invoke(): Promise<void>;
    rollback(): Promise<void>;
}
