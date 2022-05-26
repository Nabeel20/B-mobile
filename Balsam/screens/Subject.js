import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import {get_titles} from '../helper/api';
import List from './components/List';
import BackButton from './components/Back.button';
import {Colors, ThemeContext} from './Theme';
import bookmarksIcon from '../assets/bookmarksIcon.png';
import Loading from './components/Loading';

export default function Subject({route, navigation}) {
  const _animation = React.useRef(new Animated.Value(100)).current;
  const {Theme} = React.useContext(ThemeContext);
  const [loading, setLoading] = React.useState(false);
  const _status = React.useRef(true);
  const {title, list} = route.params;

  async function handle_data(id) {
    let _subjects = await get_titles(id);
    if (_subjects.status === false) {
      _status.current = false;
      return;
    }
    navigation.push('Subject', {
      title: `${title}: ${_subjects.data[0].category}`,
      list: _subjects.data,
    });
    setLoading(false);
  }
  function get_subject() {
    if (title.includes(':')) {
      const subject = title.split(':');
      return subject[0];
    }
    return title;
  }
  if (loading) {
    return (
      <Loading status={_status.current} onPress={() => setLoading(false)} />
    );
  }
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Theme.background,
        },
      ]}>
      <BackButton
        onPress={() => {
          navigation.goBack();
        }}
        _style={{alignSelf: 'flex-end'}}
      />
      <View style={{height: '30%'}} />

      <View style={styles.row}>
        <Text
          style={[
            styles.title,
            {
              color: Theme.text,
            },
          ]}>
          {title}
        </Text>

        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() =>
            navigation.navigate('Bookmarks', {subject: get_subject()})
          }>
          <Text style={styles.bookmark}>المحفوظات</Text>
          <Image source={{uri: bookmarksIcon}} style={styles.image} />
        </TouchableOpacity>
      </View>

      <List
        animation={_animation}
        onHome={false}
        data={list}
        onPress={data => {
          if (data.branch) {
            setLoading(true);
            handle_data(data.url);
            return;
          }
          navigation.navigate('Exam', {
            quiz_rtl: data.rtl,
            quiz_title: data.title,
            quiz_subject: data.subject,
            quiz_id: data.url,
            quiz_mcq: data.mcq,
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
    height: '100%',
  },
  title: {
    fontFamily: 'ReadexPro-Bold',
    fontSize: 21,
    marginRight: 8,
  },
  bookmark: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 12,
    color: Colors.blue,
  },
  bookmarkButton: {
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginBottom: 16,
    marginRight: 8,
    backgroundColor: Colors.blue_light,
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  image: {
    width: 18,
    height: 18,
    tintColor: Colors.blue,
    marginLeft: 4,
  },
});
