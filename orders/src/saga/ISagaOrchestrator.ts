export interface ISagaOrchestrator {
  invokeStep(stepNumber: number): Promise<void>;
  compensate(): Promise<void>;
}
