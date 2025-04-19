export interface ISagaStep {
  invoke(): void;
  rollback(): void;
}
