import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {List} from './components/List';
import {ThemeContext, Colors} from './Theme';
import {get_titles} from '../helper/api';
import Loading from './components/Loading';

function Title({color}) {
  const _Date = new Date();
  const _hours = _Date.getHours();
  let greet = 'أهلاً،';
  if (_hours < 12) {
    greet = 'صباح الخير،';
  }
  if (_hours >= 17 && _hours <= 24) {
    greet = 'مساء الخير،';
  }
  return <Text style={[styles.title, {color}]}>{greet} نبيل</Text>;
}

export default function Home({data, navigation}) {
  const header_animation = React.useRef(new Animated.Value(100)).current;
  const {Theme} = React.useContext(ThemeContext);
  const [loading, setLoading] = React.useState(false);
  const _status = React.useRef(true);

  React.useEffect(() => {
    header_animation.setValue(0);
    Animated.timing(header_animation, {
      toValue: 100,
      duration: 450,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Loading status={_status.current} onPress={() => setLoading(false)} />
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: Theme.background}]}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Settings')}
        style={[
          styles.settings,
          {
            backgroundColor: Theme.grey.default,
          },
        ]}>
        <Image
          source={require('../assets/gearIcon.png')}
          style={[
            styles.gearIcon,
            {
              tintColor: Theme.grey.accent_2,
            },
          ]}
        />
      </TouchableOpacity>
      <View style={{height: '20%'}} />
      <Title color={Theme.text} />
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.bookmark}
          onPress={() => navigation.navigate('Bookmarks', {subject: ''})}>
          <Image
            source={require('../assets/bookmarkIcon.png')}
            style={[styles.bookmarkIcon, {tintColor: Colors.blue}]}
          />
          <Text style={styles.text}>المحفوظات</Text>
        </TouchableOpacity>
      </View>

      <View style={{height: 48}} />

      <List
        animation={header_animation}
        data={data}
        finishedIDs={[]}
        onPress={category => {
          if (category.rtl !== undefined) {
            if (category.branch) {
              setLoading(true);
              get_titles(category.url);
              return;
            }
            navigation.navigate('Exam', {
              quiz_rtl: category.rtl,
              quiz_title: category.title,
              quiz_subject: category.subject,
              quiz_id: category.url,
            });
            return;
          }
          navigation.navigate('Subject', {
            title: category.title,
            url: category.url,
          });
        }}
      />
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    height: '100%',
  },
  settings: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    paddingBottom: 8,
    marginRight: 8,
    marginBottom: 16,
    fontFamily: 'ReadexPro-Medium',
  },
  row: {
    flex: 1,
    marginBottom: 8,
    width: '100%',
    flexDirection: 'column',
  },
  searchContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '90%',
  },
  bookmark: {
    flex: 1,
    borderRadius: 8,
    // delete this 👇
    height: 50,
    //
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.blue_light,
  },
  text: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 16,
    color: Colors.blue,
  },
  gearIcon: {
    width: 24,
    height: 24,
  },
  bookmarkIcon: {
    width: 32,
    height: 32,
  },
});
