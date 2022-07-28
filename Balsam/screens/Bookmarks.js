import React from 'react';
import {StyleSheet, FlatList, Modal, ScrollView, Image} from 'react-native';
import BackButton from './components/BackButton';
import {Colors, ThemeContext} from './Theme';

export default function Bookmarks({navigation, route, storage}) {
  const {subject} = route.params;
  const [bookmarksData, setBookmarksData] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selected_question, set_selected_question] = React.useState({});
  const {Theme, Button, Text, View} = React.useContext(ThemeContext);
  React.useEffect(() => {
    if (storage === undefined) {
      return;
    }
    let bookmarks_on_disk = JSON.parse(storage.getString('bookmarks'));
    if (subject !== '') {
      bookmarks_on_disk = bookmarks_on_disk.filter(
        item => item.subject === subject,
      );
    }
    setBookmarksData(bookmarks_on_disk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function open_question_modal(question_details) {
    question_details.choices = question_details.choices.filter(
      item => item !== question_details.correct_answer,
    );
    question_details.has_explanation = question_details.explanation.length > 5;
    set_selected_question(question_details);
    setModalVisible(true);
    return;
  }

  const Question = function ({item}) {
    return (
      <Button
        key={item.id}
        onPress={() => open_question_modal(item)}
        style={styles.list_card}>
        <Text weight="medium" size={16}>
          {item.question}
        </Text>
        <View style={styles.list_tags_container}>
          <Tag>{item.subject}</Tag>
          <Tag>{item.title}</Tag>
        </View>
      </Button>
    );
  };
  const EmptyList = function () {
    return (
      <View style={styles.empty_list_container}>
        <Image
          source={require('../assets/empty-bookmarks-icon.png')}
          style={styles.empty_image}
        />
        <Text style={styles.empty_list_text}>لم تحفظ أي من الأسئلة</Text>
      </View>
    );
  };
  function Tag({children}) {
    return (
      <View style={[styles.tag, {backgroundColor: Theme.grey.default}]}>
        <Text size={12}>{children}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} background>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.container} background>
          <View style={styles.header}>
            <BackButton onPress={() => setModalVisible(false)} />
            <Button
              onPress={() => setModalVisible(false)}
              color="red"
              style={styles.remove_button}>
              <Text style={styles.remove_button_text}>إزالة من المحفوظات</Text>
            </Button>
          </View>
          <View style={styles.tags_container}>
            <Tag>{selected_question.subject}</Tag>
            <Tag>{selected_question.title}</Tag>
          </View>
          <Text style={styles.question} weight="medium">
            {selected_question.question}
          </Text>

          <ScrollView contentContainerStyle={styles.modalScroll}>
            <Text secondary style={styles.modal_h2}>
              الإجابة الصحيحة
            </Text>
            <View style={styles.correct_answer_container}>
              <Text>{selected_question.correct_answer}</Text>
              <View style={styles.green_dot} />
            </View>
            <Text secondary padding={8}>
              باقي الخيارات
            </Text>
            {selected_question.choices?.map((choice, index) => (
              <Text padding={4} key={index}>
                {' '}
                - {choice}
              </Text>
            ))}
            {selected_question.has_explanation ? (
              <>
                <Text secondary style={styles.modal_h2}>
                  التوضيح
                </Text>
                <Text>{selected_question.explanation}</Text>
              </>
            ) : null}
          </ScrollView>
        </View>
      </Modal>

      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.header_spacer} />
      <Text style={styles.title} weight="bold">
        {`المحفوظات${subject !== '' ? ': ' + subject : ''}`}
      </Text>
      <FlatList
        contentContainerStyle={styles.empty_list_container}
        data={bookmarksData}
        ListEmptyComponent={EmptyList}
        keyExtractor={item => item.id}
        renderItem={Question}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list_tags_container: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tags_container: {
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'flex-end',
    marginTop: '10%',
  },
  title: {
    fontSize: 20,
    marginRight: 16,
    marginBottom: 16,
  },
  list_card: {
    margin: 8,
    alignItems: 'flex-end',
  },
  empty_list_text: {
    fontSize: 16,
    padding: 4,
  },
  tag: {
    padding: 6,
    borderRadius: 99,
    marginHorizontal: 4,
  },
  modalScroll: {
    padding: 8,
  },
  question: {
    fontSize: 18,
    margin: 4,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remove_button: {
    borderRadius: 8,
    padding: 8,
  },
  remove_button_text: {
    color: '#141414',
  },
  empty_image: {
    width: 80,
    height: 80,
  },
  empty_list_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal_h2: {
    fontSize: 16,
    padding: 8,
  },
  correct_answer_container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 4,
  },
  green_dot: {
    height: 10,
    width: 10,
    backgroundColor: Colors.green,
    borderRadius: 5,
    margin: 4,
  },
  header_spacer: {
    height: '20%',
  },
});
