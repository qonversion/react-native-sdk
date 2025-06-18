import {NativeEventEmitter, NativeModules} from "react-native";
import NoCodesApi from "../NoCodesApi";
import NoCodesConfig from "../dto/NoCodesConfig";
import Mapper, { QNoCodesResult } from "./Mapper";
import {NoCodesListener} from '../dto/NoCodesListener';
import {NoCodesAction, NoCodesActionType} from '../dto/NoCodesAction';

const {RNNoCodes} = NativeModules;

const sdkVersion = "1.0.0";

const EVENT_NOCODES = "NoCodesEvent";

const mapNoCodesAction = (type: string, value?: Record<string, any>): NoCodesAction => {
  return {
    type: type as NoCodesActionType,
    parameters: value
  };
};

export default class NoCodesInternal implements NoCodesApi {
  private listener: NoCodesListener | null = null;

  constructor(config: NoCodesConfig) {
    RNNoCodes.initialize(config.projectKey);

    if (config.noCodesListener) {
      this.setNoCodesListener(config.noCodesListener);
    }
  }

  async setScreenPresentationConfig(configData: Record<string, any>, contextKey?: string): Promise<void> {
    const result: QNoCodesResult = await RNNoCodes.setScreenPresentationConfig(configData, contextKey);
    Mapper.convertResult(result);
  }

  async showScreen(contextKey: string): Promise<void> {
    const result: QNoCodesResult = await RNNoCodes.showScreen(contextKey);
    Mapper.convertResult(result);
  }

  async close(): Promise<void> {
    const result: QNoCodesResult = await RNNoCodes.close();
    Mapper.convertResult(result);
  }

  setNoCodesListener(listener: NoCodesListener) {
    this.listener = listener;
    const eventEmitter = new NativeEventEmitter(RNNoCodes);
    eventEmitter.removeAllListeners(EVENT_NOCODES);
    eventEmitter.addListener(EVENT_NOCODES, rawPayload => {
      if (!this.listener) return;

      console.log('Raw payload:', rawPayload);
      
      const { event, payload } = rawPayload;
      let mappedAction: NoCodesAction | undefined;
      
      if (payload) {
        mappedAction = mapNoCodesAction(payload.type, payload.value);
      }

      switch (event) {
        case 'nocodes_screen_shown':
          console.log('SHOWN');
          this.listener.noCodesHasShownScreen(payload.id);
          break;
        case 'nocodes_action_started':
          console.log('START');
          this.listener.noCodesStartsExecuting(mappedAction!);
          break;
        case 'nocodes_action_failed':
          console.log('FAIL');
          this.listener.noCodesFailedToExecute(mappedAction!, payload.error);
          break;
        case 'nocodes_action_finished':
          console.log('Finish action');
          this.listener.noCodesFinishedExecuting(mappedAction!);
          break;
        case 'nocodes_screen_closed':
          console.log('Finish');
          this.listener.noCodesFinished();
          break;
        case 'nocodes_screen_failed_to_load':
          console.log('Failed to load');
          this.listener.noCodesFailedToLoadScreen(payload.error);
          break;
      }
    });
  }
}
