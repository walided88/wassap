






// import { AppRegistry, Platform } from 'react-native';
// import App from './App';  // Assure-toi que ce chemin est correct
// import { name as appName } from './app.json';

// // Enregistre l'application
// AppRegistry.registerComponent(appName, () => App);




import { AppRegistry, Platform } from 'react-native';
import App from './App';  // Assure-toi que ce chemin est correct
import { name as appName } from './app.json';
import { registerRootComponent } from 'expo';

registerRootComponent(App);

// Enregistre l'application
AppRegistry.registerComponent(appName, () => App);




