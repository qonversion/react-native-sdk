import {AutomationsDelegate} from './dto/AutomationsDelegate';
import {ScreenPresentationConfig} from './dto/ScreenPresentationConfig';

interface AutomationsApi {
  /**
   * The Automations delegate is responsible for handling in-app screens and actions when push notification is received.
   * Make sure the method is called before {@link AutomationsApi.handleNotification}.
   *
   * @param delegate the delegate to be notified about Automations events.
   */
  setDelegate(delegate: AutomationsDelegate): void;

  /**
   * Set push token to Qonversion to enable Qonversion push notifications
   *
   * @deprecated Consider removing this method calls. Qonversion is not working with push notifications anymore.
   * @param token Firebase device token for Android. APNs device token for iOS.
   */
  setNotificationsToken(token: string): void;

  /**
   * Call to handle push notifications sent by Qonversion Automations.
   *
   * @deprecated Consider removing this method calls. Qonversion is not working with push notifications anymore.
   * @param notificationData notification payload data
   * @returns true when a push notification was received from Qonversion. Otherwise, returns false, so you need to handle the notification yourself
   *
   * @see [Firebase RemoteMessage data](https://pub.dev/documentation/firebase_messaging_platform_interface/latest/firebase_messaging_platform_interface/RemoteMessage/data.html)
   * @see [APNs notification data](https://developer.apple.com/documentation/usernotifications/unnotificationcontent/1649869-userinfo)
   */
  handleNotification(notificationData: Map<String, Object>): Promise<boolean>;

  /**
   * Get parsed custom payload, which you added to the notification in the dashboard
   *
   @deprecated Consider removing this method calls. Qonversion is not working with push notifications anymore.
   * @param notificationData notification payload data
   * @returns a map with custom payload from the notification or null if it's not provided.
   */
  getNotificationCustomPayload(notificationData: Map<string, Object>): Promise<Map<string, Object> | null>;

  /**
   * Show the screen using its ID.
   * @param screenId identifier of the screen which must be shown
   * @returns promise to await for completion.
   */
  showScreen(screenId: string): Promise<void>;

  /**
   * Set the configuration of screen representation.
   * @param config a configuration to apply.
   * @param screenId identifier of screen, to which a config should be applied.
   *                 If not provided, the config is used for all the screens.
   */
  setScreenPresentationConfig(config: ScreenPresentationConfig, screenId?: string): void;
}

export default AutomationsApi;
