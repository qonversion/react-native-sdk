import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';
import type { QNoCodeAction, QNoCodesError, QNoCodeScreenInfo } from '../Mapper';

export type NoCodeEvent = {
  name: string;
  payload: QNoCodeAction | QNoCodesError | QNoCodeScreenInfo | undefined;
};

export interface Spec extends TurboModule {
  initialize(projectKey: string): void;
  setScreenPresentationConfig(configData: Object, contextKey?: string): Promise<boolean>;
  showScreen(contextKey: string): Promise<boolean>;
  close(): Promise<boolean>;

  readonly onNoCodeEvent: EventEmitter<NoCodeEvent>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNNoCodes');
