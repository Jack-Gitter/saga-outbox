export interface ISagaOrchestrator {
    begin(): Promise<void>;
}
