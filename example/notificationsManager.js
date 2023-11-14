import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';

const NotificationsManager = {
  init: () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('Device token:', token);
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
          // handle push notification
        }

        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    });
  },
};

export default NotificationsManager;
