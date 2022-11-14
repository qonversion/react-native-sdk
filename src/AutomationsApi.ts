import {AutomationsDelegate} from './dto/AutomationsDelegate';

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
   * @param token Firebase device token on Android. APNs device token on iOS.
   */
  setNotificationsToken(token: string): void;

  /**
   * Call to handle push notifications sent by Qonversion Automation.
   *
   * @param notificationData notification payload data
   * @return true when a push notification was received from Qonversion. Otherwise, returns false, so you need to handle a notification yourself
   *
   * @see [Firebase RemoteMessage data](https://pub.dev/documentation/firebase_messaging_platform_interface/latest/firebase_messaging_platform_interface/RemoteMessage/data.html)
   * @see [APNs notification data](https://developer.apple.com/documentation/usernotifications/unnotificationcontent/1649869-userinfo)
   */
  handleNotification(notificationData: Map<String, Object>): Promise<boolean>;

  /**
   * Get parsed custom payload, which you added to the notification in the dashboard
   *
   * @param notificationData notification payload data
   * @return a map with custom payload from the notification or null if it's not provided.
   */
  getNotificationCustomPayload(notificationData: Map<string, Object>): Promise<Map<string, Object> | null>;
}

export default AutomationsApi;
