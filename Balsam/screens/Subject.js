import React from 'react';
import {StyleSheet} from 'react-native';
import {List} from './components/List/index';
import {ThemeContext} from './Theme';
import BackButton from './components/BackButton';
import Loading from './components/Loading';

export default function Subject({route, navigation}) {
  const {Button, Text, View} = React.useContext(ThemeContext);
  const [loading, setLoading] = React.useState(true);
  const {title: subject_title, url: subject_url} = route.params;
  const [list_data, set_list_data] = React.useState([]);
  const [loading_error, set_loading_error] = React.useState(false);
  function get_subjects_json(data) {
    data = data.split('\n');
    let output = [];
    for (let index = 1; index < data.length; index++) {
      const [title, rtl, mcq, branch, editor_choice, is_new, number, url, id] =
        data[index].split(',');
      output.push({
        title: title.replace(/"/g, ''),
        rtl: rtl.replace(/"/g, '') === 'TRUE' ? true : false,
        mcq: mcq.replace(/"/g, '') === 'TRUE' ? true : false,
        branch: branch.replace(/"/g, '') === 'TRUE' ? true : false,
        number: number.replace(/"/g, ''),
        is_new: is_new.replace(/"/g, '') === 'TRUE' ? true : false,
        url: url.replace(/"/g, ''),
        id: id.replace(/"/g, ''),
        editor_choice:
          editor_choice.replace(/"/g, '') === 'TRUE' ? true : false,
      });
    }
    return output;
  }
  React.useEffect(() => {
    if (subject_url === undefined) {
      return;
    }
    async function handle_data() {
      try {
        fetch(
          `https://docs.google.com/spreadsheets/d/${subject_url}/export?format=csv`,
        )
          .then(res => res.text())
          .then(data => {
            set_list_data(get_subjects_json(data));
            setLoading(false);
          });
      } catch (error) {
        set_loading_error(true);
      }
    }
    handle_data();
  }, [subject_url]);
  function get_subject() {
    if (subject_title.includes(':')) {
      const subject = subject_title.split(':');
      return subject[0];
    }
    return subject_title;
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button
          color="blue"
          round
          onPress={() =>
            navigation.navigate('Bookmarks', {subject: get_subject()})
          }>
          <Text color="blue" weight="medium">
            المحفوظات
          </Text>
        </Button>
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>

      <View style={styles.header_spacer} />

      <Text style={styles.title} weight="medium">
        {subject_title}
      </Text>
      {loading ? (
        <Loading status={loading_error} onPress={() => setLoading(false)} />
      ) : (
        <List
          data={list_data}
          onPress={list_item => {
            if (list_item.branch) {
              navigation.push('Subject', {
                title: `${subject_title}: ${list_item.title}`,
                url: list_item.url,
              });
              return;
            }
            navigation.navigate('Exam', {
              quiz_rtl: list_item.rtl,
              quiz_title: list_item.title,
              quiz_subject: subject_title,
              quiz_id: list_item.url,
              quiz_mcq: list_item.mcq,
            });
          }}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginRight: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header_spacer: {
    height: '20%',
  },
});
