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
  useColorScheme,
  ToastAndroid,
} from 'react-native';
import Settings from './screens/Settings';
import Subject from './screens/Subject';
import Exam from './screens/Exam';
import Bookmarks from './screens/Bookmarks';
import Home from './screens/Home';
import {MMKV} from 'react-native-mmkv';
import {useNetInfo} from '@react-native-community/netinfo';

const Stack = createNativeStackNavigator();
const storage = new MMKV() ?? undefined;

function load_bookmarks() {
  try {
    let bookmarks_on_disk = storage.getString('bookmarks');
    if (bookmarks_on_disk === undefined) {
      storage.set('bookmarks', JSON.stringify([]));
      return [];
    }
    bookmarks_on_disk = JSON.parse(bookmarks_on_disk);
    return bookmarks_on_disk;
  } catch (error) {
    ToastAndroid.showWithGravity(
      'فشل تحميل المحفوظات',
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    );
  }
}

const bookmarks = load_bookmarks() ?? [];

function App() {
  const color_scheme = useColorScheme() ?? 'light';
  const home_data = React.useRef([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function handle_data() {
      try {
        fetch(
          'https://docs.google.com/spreadsheets/d/1J9B9-Jbs8c4iUury3ds4ktZj7Mjn6I7gk1l6RHT5f0w/export?format=csv',
        )
          .then(res => res.text())
          .then(data => {
            home_data.current = get_categories(data);
            setLoading(false);
          });
      } catch (error) {
        ToastAndroid.show(JSON.stringify(error), ToastAndroid.LONG);
      }
    }
    function get_categories(data) {
      data = data.split('\n');
      let output = [];
      for (let index = 1; index < data.length; index++) {
        const [title, has_updates, details, icon, url, id] =
          data[index].split(',');
        output.push({
          title: title.replace(/"/g, ''),
          url: url.replace(/"/g, ''),
          id: id.replace(/"/g, ''),
          icon: icon.replace(/"/g, ''),
          has_updates: has_updates.replace(/"/g, '') === 'TRUE' ? true : false,
          details: details.replace(/"/g, ''),
        });
      }
      return output;
    }
    handle_data();
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: color_scheme === 'dark' ? '#212121' : '#ffffff',
          },
        ]}>
        <Image
          source={require('./assets/logo-icon.png')}
          style={[
            styles.logo,
            {tintColor: color_scheme === 'dark' ? '#ffffff' : '#212121'},
          ]}
        />
        <Text
          style={[
            styles.logoText,
            {
              color: color_scheme === 'dark' ? '#ffffff' : '#141414',
            },
          ]}>
          بلسم
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
          screenOptions={{headerShown: false}}
          animation="fade_from_bottom">
          <Stack.Screen name="Home">
            {props => (
              <Home {...props} data={home_data.current} storage={storage} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Subject" component={Subject} />
          <Stack.Screen name="Exam">
            {props => (
              <Exam {...props} storage={storage} bookmarksIDs={bookmarks} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Bookmarks">
            {props => (
              <Bookmarks {...props} data={bookmarks} storage={storage} />
            )}
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
