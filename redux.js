import { AppRegistry } from 'react-native';
import App from './App'; // Assurez-vous que le chemin vers App est correct
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
