export interface ISagaOrchestrator<T> {
  invokeStep(step: T): void;
  compensate(step: T): void;
}
