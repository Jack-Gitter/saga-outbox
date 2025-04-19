export interface ISagaOrchestrator<T> {
  invokeStep(stepNumber: T): Promise<void>;
  compensate(): Promise<void>;
}
