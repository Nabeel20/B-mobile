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
import List from './components/List';
import {ThemeContext, Colors, defaultButtonStyle} from './Theme';
import {get_titles} from '../helper/api';
import Loading from './components/Loading';
import SearchBar from './components/SearchBar';

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
  const textInput_ref = React.useRef(null);
  const played_once = React.useRef(false);

  const {Theme} = React.useContext(ThemeContext);
  const [loading, setLoading] = React.useState(false);
  const _status = React.useRef(true);
  const [userInput, setInput] = React.useState('');

  React.useEffect(() => {
    header_animation.setValue(0);
    Animated.timing(header_animation, {
      toValue: 100,
      duration: 450,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [played_once.current]);

  React.useEffect(() => {
    if (userInput.length === 0 && played_once.current) {
      header_animation.setValue(0);
      Animated.timing(header_animation, {
        toValue: 100,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInput, played_once.current]);

  function clear_text_input() {
    textInput_ref.current.clear();
    setInput('');
    played_once.current = false;
    textInput_ref.current.focus();
  }
  function handle_user_input(text) {
    if (played_once.current === false) {
      played_once.current = true;
    }
    setInput(text);
  }

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
            borderColor: Theme.grey.accent_2,
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
        <SearchBar
          autoFocus={false}
          onFocus={() => navigation.push('Search')}
        />
        <TouchableOpacity
          style={styles.bookmark}
          onPress={() => navigation.navigate('Bookmarks', {subject: ''})}>
          <Image
            source={require('../assets/bookmarkIcon.png')}
            style={[styles.bookmarkIcon, {tintColor: Colors.blue}]}
          />
        </TouchableOpacity>
      </View>

      <View style={{height: 48}} />

      <List
        animation={header_animation}
        keywords={userInput}
        data={data}
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
            list: category.list,
          });
        }}
        onClear={clear_text_input}
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
    ...defaultButtonStyle,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
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
  searchBar: {
    flex: 1,
    borderRadius: 10,
    marginRight: 16,
    borderWidth: 1,
    padding: 8,
    fontSize: 14,
    textAlign: 'right',
    fontFamily: 'ReadexPro-Regular',
  },
  searchContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '90%',
  },
  bookmark: {
    width: 50,
    height: 50,
    marginLeft: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blue_light,
  },
  clearButtonText: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 14,
  },
  clearButtonContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  gearIcon: {
    width: 24,
    height: 24,
  },
  bookmarkIcon: {
    width: 30,
    height: 30,
  },
});
