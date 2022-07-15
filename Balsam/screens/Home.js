import React from 'react';
import {StyleSheet, Animated, Image} from 'react-native';
import {List} from './components/List/index';
import {ThemeContext} from './Theme';

export default function Home({data, navigation, storage}) {
  const header_animation = React.useRef(new Animated.Value(100)).current;
  const {Theme, Button, Text, View} = React.useContext(ThemeContext);
  const [greeting, set_greeting] = React.useState('');

  React.useEffect(() => {
    header_animation.setValue(0);
    Animated.timing(header_animation, {
      toValue: 100,
      duration: 450,
      useNativeDriver: false,
    }).start();
    function get_title() {
      const _Date = new Date();
      const _hours = _Date.getHours();
      let _greeting = 'أهلاً،';
      if (_hours < 12) {
        _greeting = 'صباح الخير،';
      }
      if (_hours >= 17 && _hours <= 24) {
        _greeting = 'مساء الخير،';
      }
      return `${_greeting} نبيل`;
    }
    set_greeting(get_title());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container} background>
      <Button
        onPress={() => navigation.navigate('Settings')}
        style={styles.settings_button}
        color="grey">
        <Image
          source={require('../assets/gearIcon.png')}
          style={[
            styles.settings_icon,
            {
              tintColor: Theme.grey.accent_2,
            },
          ]}
        />
      </Button>
      <View style={styles.header_spacer} />
      <View style={styles.header}>
        <Text style={styles.title} weight="bold">
          {greeting}
        </Text>
        <Button
          color="blue"
          round
          onPress={() => navigation.navigate('Bookmarks', {subject: ''})}>
          <Text color="blue" size={16} weight="medium">
            المحفوظات
          </Text>
        </Button>
      </View>
      <List
        data={data}
        onHome
        doneIds={[]}
        onPress={category => {
          navigation.navigate('Subject', {
            title: category.title,
            url: category.url,
          });
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settings_button: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settings_icon: {
    height: 24,
    width: 24,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    marginRight: 8,
  },
  header_spacer: {
    height: '20%',
  },
});
