import {NativeEventEmitter, NativeModules} from "react-native";
import NoCodesApi from "../NoCodesApi";
import NoCodesConfig from "../NoCodesConfig";
import Mapper from "./Mapper";
import {NoCodesListener} from '../dto/NoCodesListener';
import ScreenPresentationConfig from '../dto/ScreenPresentationConfig';
import NoCodesError from '../dto/NoCodesError';
import {NoCodesErrorCode} from '../dto/enums';

const {RNNoCodes} = NativeModules;

const EVENT_SCREEN_SHOWN = "nocodes_screen_shown";
const EVENT_FINISHED = "nocodes_finished";
const EVENT_ACTION_STARTED = "nocodes_action_started";
const EVENT_ACTION_FAILED = "nocodes_action_failed";
const EVENT_ACTION_FINISHED = "nocodes_action_finished";
const EVENT_SCREEN_FAILED_TO_LOAD = "nocodes_screen_failed_to_load";

export default class NoCodesInternal implements NoCodesApi {
  constructor(config: NoCodesConfig) {
    RNNoCodes.initialize(config.projectKey);

    if (config.noCodesListener) {
      this.setNoCodesListener(config.noCodesListener);
    }
  }

  async setScreenPresentationConfig(config: ScreenPresentationConfig, contextKey?: string) {
    const data = Mapper.convertScreenPresentationConfig(config);
    await RNNoCodes.setScreenPresentationConfig(data, contextKey);
  }

  async showScreen(contextKey: string) {
    await RNNoCodes.showScreen(contextKey);
  }

  async close() {
    await RNNoCodes.close();
  }

  setNoCodesListener(listener: NoCodesListener) {
    const eventEmitter = new NativeEventEmitter(RNNoCodes);

    eventEmitter.removeAllListeners(EVENT_SCREEN_SHOWN);
    eventEmitter.addListener(EVENT_SCREEN_SHOWN, payload => {
      const screenId = payload["screenId"] ?? "";
      listener.onScreenShown(screenId);
    });

    eventEmitter.removeAllListeners(EVENT_ACTION_STARTED);
    eventEmitter.addListener(EVENT_ACTION_STARTED, payload => {
      const action = Mapper.convertAction(payload);
      listener.onActionStartedExecuting(action);
    });

    eventEmitter.removeAllListeners(EVENT_ACTION_FAILED);
    eventEmitter.addListener(EVENT_ACTION_FAILED, payload => {
      const action = Mapper.convertAction(payload);
      listener.onActionFailedToExecute(action);
    });

    eventEmitter.removeAllListeners(EVENT_ACTION_FINISHED);
    eventEmitter.addListener(EVENT_ACTION_FINISHED, payload => {
      const action = Mapper.convertAction(payload);
      listener.onActionFinishedExecuting(action);
    });

    eventEmitter.removeAllListeners(EVENT_FINISHED);
    eventEmitter.addListener(EVENT_FINISHED, () => {
      listener.onFinished();
    });

    eventEmitter.removeAllListeners(EVENT_SCREEN_FAILED_TO_LOAD);
    eventEmitter.addListener(EVENT_SCREEN_FAILED_TO_LOAD, payload => {
      const error = Mapper.convertNoCodesError(payload);
      const defaultError = new NoCodesError(
        NoCodesErrorCode.UNKNOWN,
        "Failed to load No-Code screen",
        "Native error parsing failed."
      );
      listener.onScreenFailedToLoad(error ?? defaultError);
    });
  }
}
