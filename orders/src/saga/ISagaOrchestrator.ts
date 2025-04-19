export interface ISagaOrchestrator {
  invokeNext(): Promise<void>;
  compensate(): Promise<void>;
}
