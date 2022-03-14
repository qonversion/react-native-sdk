import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import Qonversion from 'react-native-qonversion';

const NotificationsManager = {
  init: () => {
    PushNotification.configure({
      onRegister: function(token) {
        console.log('TOKEN:', token);
        Qonversion.setNotificationsToken(token.token);
      },

      onNotification: async function(notification) {
        console.log('NOTIFICATION:', notification);

        if (notification.userInteraction) {
          const isQonversionNotification = await Qonversion.handleNotification(
            // todo check content
            notification,
          );
          console.log(
            'NOTIFICATION HANDLED BY QONVERSION:',
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
