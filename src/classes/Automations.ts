import {AutomationsDelegate} from "./AutomationsDelegate";
import {NativeEventEmitter, NativeModules} from "react-native";
import Mapper from "./Mapper";
const {RNAutomations} = NativeModules;

const EVENT_SCREEN_SHOWN = "automations_screen_shown";
const EVENT_ACTION_STARTED = "automations_action_started";
const EVENT_ACTION_FAILED = "automations_action_failed";
const EVENT_ACTION_FINISHED = "automations_action_finished";
const EVENT_AUTOMATIONS_FINISHED = "automations_finished";

export default class Automations {

  /**
   * The Automations delegate is responsible for handling in-app screens and actions when push notification is received.
   * Make sure the method is called before Qonversion.handleNotification.
   * @param delegate the delegate to be notified about Automations events.
   */
  static setDelegate(delegate: AutomationsDelegate) {
    Automations.subscribe(delegate);
  }

  private static subscribe(automationsDelegate: AutomationsDelegate) {
    const eventEmitter = new NativeEventEmitter(RNAutomations);

    eventEmitter.removeAllListeners(EVENT_SCREEN_SHOWN);
    eventEmitter.addListener(EVENT_SCREEN_SHOWN, payload => {
      const screenId = payload["screenId"];
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
