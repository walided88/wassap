import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import ChatChoiceScreen from './ChatChoiceScreen';
import PublicChatScreen from './PublicChatScreen';
import PrivateChatScreen from './PrivateChatScreen';
import PrivateChatComponent from './PrivateChatComponent';
import store from './store'; // Import du store
import { Provider, useSelector } from 'react-redux';
import { showNotification } from './Notification'; // Importation de la fonction
import messaging from '@react-native-firebase/messaging';
import Notification from './Notification';



const Stack = createStackNavigator();

const AppContent = () => {

  // Récupère la valeur booléenne de l'état et le string de notification
  const myBoolean = useSelector((state) => state.boolean.value);
  const newMessage = useSelector((state) => state.string.value);

  // // // Utilise useEffect pour montrer la notification lorsque myBoolean et newMessage remplissent les conditions
  // useEffect(() => {
 
  //   if (newMessage == "xx" && myBoolean==false) {
  //     showNotification('Nouveau message', 'Vous avez reçu un nouveau message !');
  //   }
  // }, [ newMessage]); // La notification sera déclenchée dès que les valeurs changent.

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ChatChoice" component={ChatChoiceScreen} />
        <Stack.Screen name="PublicChat" component={PublicChatScreen} />
        <Stack.Screen name="PrivateChat" component={PrivateChatScreen} />
        <Stack.Screen name="PrivateChatComponent" component={PrivateChatComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
            <Notification />
      <AppContent /> 
    </Provider>
  );
};

export default App;






// // Demander la permission pour recevoir des notifications
// useEffect(() => {
//   const requestUserPermission = async () => {
//     const authStatus = await messaging().requestPermission();
//     const enabled = 
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       console.log('Authorization status:', authStatus);
//     }
//   };

//   requestUserPermission();

//   // Recevoir les messages lorsque l'application est en premier plan
//   const unsubscribe = messaging().onMessage(async remoteMessage => {
//     console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
//     // showNotification('Nouveau message', 'Vous avez reçu un nouveau message !');
//   });

//   return unsubscribe;
// }, []);

// // Gérer les notifications lorsqu'elles sont reçues en arrière-plan ou lorsque l'appli est fermée
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
//       // showNotification('Nouveau message', 'Vous avez reçu un nouveau message !');
// });