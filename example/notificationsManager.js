import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import Qonversion from 'react-native-qonversion';

const NotificationsManager = {
  init: () => {
    PushNotification.configure({
      onRegister: function(token) {
        console.log('Device token:', token);
        Qonversion.setNotificationsToken(token.token);
      },

      onNotification: async function(notification) {
        console.log('Notification:', notification);

        if (notification.userInteraction) {
          const notificationData = JSON.parse(
            notification.data.notificationData,
          );
          const isQonversionNotification = await Qonversion.handleNotification(
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
