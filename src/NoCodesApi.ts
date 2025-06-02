export default interface NoCodesApi {
  setScreenPresentationConfig(configData: Record<string, any>, contextKey?: string): Promise<void>;
  showScreen(contextKey: string): Promise<void>;
  close(): Promise<void>;
} 