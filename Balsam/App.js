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
//import Exam from './screens/Exam';
import Bookmarks from './screens/Bookmarks';
import Home from './screens/Home';
import {get_data, get_quiz} from './helper/api';
import Search from './screens/Search';
import BackButton from './screens/components/Back.button';

const Stack = createNativeStackNavigator();
I18nManager.allowRTL(false);

function Exam({route, navigation}) {
  const {quiz_rtl, quiz_title, quiz_subject, quiz_id, quiz_mcq} = route.params;
  const [data, setData] = React.useState('loading...');
  React.useEffect(() => {
    async function fetch_quiz_data(id) {
      const quiz_data = await get_quiz(id);
      if (quiz_data.status === false) {
        setData(`failed: error log: ${quiz_data.error_message}`);
        return;
      }
      setData(quiz_data.data);
    }
    fetch_quiz_data();
  }, [quiz_id]);
  return (
    <View style={{padding: 16}}>
      <BackButton onPress={() => navigation.goBack()} />
      <Text>
        {JSON.stringify(
          {quiz_rtl, quiz_title, quiz_subject, quiz_id, quiz_mcq},
          null,
          2,
        )}
      </Text>
      <Text style={{marginTop: 20, color: '#212121'}}>
        {JSON.stringify(data)}
      </Text>
    </View>
  );
}

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
            backgroundColor: color_scheme === 'dark' ? '#212121' : '#ffffff',
          },
        ]}>
        <Image
          source={require('./assets/logo.png')}
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
          animation="fade_from_bottom"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home">
            {props => <Home {...props} data={home_data.current} />}
          </Stack.Screen>
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Subject" component={Subject} />
          <Stack.Screen name="Exam" component={Exam} />
          <Stack.Screen name="Search" component={Search} />
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
