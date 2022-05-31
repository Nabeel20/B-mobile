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
import Loading from './components/Loading';

export default function Subject({route, navigation}) {
  const _animation = React.useRef(new Animated.Value(100)).current;
  const {Theme} = React.useContext(ThemeContext);
  const [loading, setLoading] = React.useState(false);
  const _status = React.useRef(true);
  const {title, finishedIDs, url} = route.params;
  const [listData, setListData] = React.useState([]);
  React.useEffect(() => {
    if (url === undefined) {
      return;
    }
    async function handle_data(id) {
      let _subjects = await get_titles(url);
      if (_subjects.status === false) {
        _status.current = false;
        return;
      }
      setListData(_subjects.data);
    }
    handle_data();
  }, [url]);

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
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() =>
            navigation.navigate('Bookmarks', {subject: get_subject()})
          }>
          <Text style={styles.bookmark}>المحفوظات</Text>
          <Image
            source={require('../assets/bookmarksIcon.png')}
            style={styles.image}
          />
        </TouchableOpacity>
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
      <View style={{height: '20%'}} />
      <Text
        style={[
          styles.title,
          {
            color: Theme.text,
          },
        ]}>
        {title}
      </Text>
      <List
        animation={_animation}
        data={listData}
        finishedIDs={finishedIDs}
        onPress={data => {
          if (data.branch) {
            navigation.push('Subject', {
              title: `${data.subject}: ${data.title}`,
              url: data.url,
            });
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
    marginBottom: 16,
  },
  bookmark: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14,
    color: Colors.blue,
  },
  bookmarkButton: {
    padding: 8,
    borderRadius: 8,
    margin: 8,
    alignSelf: 'flex-end',
    backgroundColor: Colors.blue_light,
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 20,
    height: 20,
    tintColor: Colors.blue,
    marginLeft: 4,
  },
});
