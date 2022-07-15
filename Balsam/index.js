/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Text, TextInput, I18nManager} from 'react-native';
I18nManager.allowRTL(false);
// Text.defaultProps = Text.defaultProps || {};
// Text.defaultProps.allowFontScaling = false;

// TextInput.defaultProps = Text.defaultProps || {};
// TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => App);
