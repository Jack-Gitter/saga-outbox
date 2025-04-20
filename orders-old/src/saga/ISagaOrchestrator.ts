export interface ISagaOrchestrator<T> {
  invokeStep(step: T): void;
  compensateStep(step: T): void;
}
