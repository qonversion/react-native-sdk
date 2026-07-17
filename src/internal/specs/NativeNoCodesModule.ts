import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  initialize(projectKey: string, source: string, version: string, proxyUrl?: string, locale?: string, theme?: string): void;
  setScreenPresentationConfig(configData: Object, contextKey?: string): Promise<boolean>;
  showScreen(contextKey: string, customVariables?: { [key: string]: string }): Promise<boolean>;
  loadScreen(contextKey: string): Promise<Object>;
  close(): Promise<boolean>;
  setPurchaseDelegate(): void;
  setLocale(locale: string | null): void;
  setTheme(theme: string): void;

  // Methods to notify native code about purchase/restore results
  delegatedPurchaseCompleted(): void;
  delegatedPurchaseFailed(errorMessage: string): void;
  delegatedRestoreCompleted(): void;
  delegatedRestoreFailed(errorMessage: string): void;

  readonly onNoCodeEvent: EventEmitter<Object>; // NoCodeEvent (defined in NoCodesInternal.ts)
  readonly onNoCodePurchase: EventEmitter<Object>; // QProduct
  readonly onNoCodeRestore: EventEmitter<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNNoCodes');
