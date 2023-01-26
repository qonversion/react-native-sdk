import {AutomationsDelegate} from "../dto/AutomationsDelegate";
import {NativeEventEmitter, NativeModules} from "react-native";
import Mapper from "./Mapper";
import AutomationsApi from '../AutomationsApi';
import {ScreenPresentationConfig} from '../dto/ScreenPresentationConfig';

const {RNAutomations} = NativeModules;

const EVENT_SCREEN_SHOWN = "automations_screen_shown";
const EVENT_ACTION_STARTED = "automations_action_started";
const EVENT_ACTION_FAILED = "automations_action_failed";
const EVENT_ACTION_FINISHED = "automations_action_finished";
const EVENT_AUTOMATIONS_FINISHED = "automations_finished";

export default class AutomationsInternal implements AutomationsApi {

  setDelegate(delegate: AutomationsDelegate) {
    AutomationsInternal.subscribe(delegate);
  }

  setNotificationsToken(token: string) {
    RNAutomations.setNotificationsToken(token);
  }

  async handleNotification(notificationData: Map<String, Object>): Promise<boolean> {
    try {
      return await RNAutomations.handleNotification(notificationData);
    } catch (e) {
      return false;
    }
  }

  async getNotificationCustomPayload(notificationData: Map<string, Object>): Promise<Map<string, Object> | null> {
    try {
      return await RNAutomations.getNotificationCustomPayload(notificationData) ?? null;
    } catch (e) {
      return null;
    }
  }

  async showScreen(screenId: string): Promise<void> {
    return await RNAutomations.showScreen(screenId);
  }

  setScreenPresentationConfig(config: ScreenPresentationConfig, screenId?: string): void {
    const data = Mapper.convertScreenPresentationConfig(config);
    RNAutomations.setScreenPresentationConfig(data, screenId);
  }

  private static subscribe(automationsDelegate: AutomationsDelegate) {
    const eventEmitter = new NativeEventEmitter(RNAutomations);

    eventEmitter.removeAllListeners(EVENT_SCREEN_SHOWN);
    eventEmitter.addListener(EVENT_SCREEN_SHOWN, payload => {
      const screenId = payload["screenId"] ?? "";
      automationsDelegate.automationsDidShowScreen(screenId);
    });

    eventEmitter.removeAllListeners(EVENT_ACTION_STARTED);
    eventEmitter.addListener(EVENT_ACTION_STARTED, payload => {
      const actionResult = Mapper.convertActionResult(payload);
      automationsDelegate.automationsDidStartExecuting(actionResult);
    });

    eventEmitter.removeAllListeners(EVENT_ACTION_FAILED);
    eventEmitter.addListener(EVENT_ACTION_FAILED, payload => {
      const actionResult = Mapper.convertActionResult(payload);
      automationsDelegate.automationsDidFailExecuting(actionResult);
    });

    eventEmitter.removeAllListeners(EVENT_ACTION_FINISHED);
    eventEmitter.addListener(EVENT_ACTION_FINISHED, payload => {
      const actionResult = Mapper.convertActionResult(payload);
      automationsDelegate.automationsDidFinishExecuting(actionResult);
    });

    eventEmitter.removeAllListeners(EVENT_AUTOMATIONS_FINISHED);
    eventEmitter.addListener(EVENT_AUTOMATIONS_FINISHED, () => {
      automationsDelegate.automationsFinished();
    });

    RNAutomations.subscribe();
  }
}
