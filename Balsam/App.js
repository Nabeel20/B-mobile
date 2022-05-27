import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeProvider} from './screens/Theme';
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  I18nManager,
  useColorScheme,
} from 'react-native';
import Settings from './screens/Settings';
import Subject from './screens/Subject';
import Exam from './screens/Exam';
import Bookmarks from './screens/Bookmarks';
import Home from './screens/Home';
import {get_data} from './helper/api';

const Stack = createNativeStackNavigator();
I18nManager.allowRTL(false);

function App() {
  const color_scheme = useColorScheme() || 'light';
  const home_data = React.useRef([]);
  const bookmarks_data = React.useRef([]);
  const [loading, setLoading] = React.useState(true);
  const error_log = React.useRef('');
  async function handle_data() {
    let _subjects = await get_data();
    if (_subjects.status === false) {
      error_log.current = _subjects.error_message;
      setLoading(false);
      return;
    }
    home_data.current = _subjects.data;
    setLoading(false);
  }
  React.useEffect(() => {
    function load_bookmarks() {
      const BM = [];
      bookmarks_data.current = BM;
      return;
    }
    load_bookmarks();
    handle_data();
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: color_scheme === 'dark' ? '#ffffff' : '#212121',
          },
        ]}>
        <Image source={require('./assets/logo.png')} style={styles.logo} />
        <Text
          style={[
            styles.logoText,
            {
              color: color_scheme === 'dark' ? '#ffffff' : '#141414',
            },
          ]}>
          بــــلـــــــــــســــم
        </Text>
        <ActivityIndicator
          size="small"
          color={color_scheme === 'dark' ? '#ffffff' : '#212121'}
          style={styles.loading}
        />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home">
            {props => <Home {...props} data={home_data.current} />}
          </Stack.Screen>
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Subject" component={Subject} />
          <Stack.Screen name="Exam" component={Exam} />
          <Stack.Screen name="Bookmarks">
            {props => <Bookmarks {...props} data={bookmarks_data.current} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  logoText: {
    fontFamily: 'ReadexPro-Bold',
    fontSize: 32,
    marginTop: 32,
    marginBottom: 32,
  },
  loadingIndicator: {
    alignSelf: 'center',
  },
  logo: {
    width: 98,
    height: 127,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default App;
