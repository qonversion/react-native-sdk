import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {Automations} from 'react-native-qonversion';
import {Platform} from 'react-native';

const NotificationsManager = {
  init: () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('Device token:', token);
        Automations.getSharedInstance().setNotificationsToken(token.token);
      },

      onNotification: async function (notification) {
        console.log('Notification:', notification);

        if (notification.userInteraction) {
          let notificationData = '';
          if (Platform.OS === 'ios') {
            notificationData = notification.data;
          } else if (Platform.OS === 'android') {
            notificationData = JSON.parse(notification.data.notificationData);
          }
          const isQonversionNotification =
            await Automations.getSharedInstance().handleNotification(
              notificationData,
            );
          console.log(
            'Is notification handled by Qonversion: ',
            isQonversionNotification,
          );
          if (!isQonversionNotification) {
            // handle push notification yourself
          }
        }

        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    });
  },
};

export default NotificationsManager;
