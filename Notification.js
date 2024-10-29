// import PushNotification from 'react-native-push-notification';
// import { useEffect } from 'react';

// // Créer le canal de notification
// const createNotificationChannel = () => {
//   PushNotification.createChannel(
//     {
//       channelId: "default-channel-id",
//       channelName: "Default Channel",
//       channelDescription: "A channel to categorize your notifications",
//       playSound: true,
//       soundName: "default",
//       importance: 4,
//       vibrate: true,
//     },
//     (created) => console.log(`createChannel returned '${created}'`)
//   );
// };

// // Fonction pour afficher une notification
// export const showNotification = (title, message) => {
//   PushNotification.localNotification({
//     channelId: "default-channel-id", // Assurez-vous que le canal existe
//     title: title,
//     message: message,
//     playSound: true,
//     soundName: "default",
//   });
// };

// // Composant Notification pour créer le canal à l'initialisation
// const Notification = () => {
//   useEffect(() => {
//     createNotificationChannel();
//   }, []);

//   return null; // Rien à afficher dans ce composant
// };

// export default Notification;














import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

// Configuration des paramètres des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Fonction pour afficher une notification
export const showNotification = (title, message) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: message,
    },
    trigger: { seconds: 1 },
  });
};

// Composant Notification pour demander les permissions
const Notification = () => {
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission refusée pour les notifications!');
      }
    })();
  }, []);

  return null; // Ce composant n'affiche rien
};

export default Notification;
