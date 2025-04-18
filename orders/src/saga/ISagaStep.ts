export interface ISagaStep {
  invoke(): Promise<void>;
  rollback(): Promise<void>;
}
