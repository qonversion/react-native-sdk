import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';
import type { QNoCodeAction, QNoCodesError, QNoCodeScreenInfo } from '../Mapper';

export type NoCodeEvent = {
  name: string;
  payload: QNoCodeAction | QNoCodesError | QNoCodeScreenInfo | undefined;
};

export interface Spec extends TurboModule {
  initialize(projectKey: string, source: string, version: string, proxyUrl?: string): void;
  setScreenPresentationConfig(configData: Object, contextKey?: string): Promise<boolean>;
  showScreen(contextKey: string): Promise<boolean>;
  close(): Promise<boolean>;
  setPurchaseDelegate(): void;

  // Methods to notify native code about purchase/restore results
  delegatedPurchaseCompleted(): void;
  delegatedPurchaseFailed(errorMessage: string): void;
  delegatedRestoreCompleted(): void;
  delegatedRestoreFailed(errorMessage: string): void;

  readonly onNoCodeEvent: EventEmitter<NoCodeEvent>;
  readonly onNoCodePurchase: EventEmitter<Object>; // QProduct
  readonly onNoCodeRestore: EventEmitter<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNNoCodes');
