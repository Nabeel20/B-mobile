import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import BackButton from './components/Back.button';
import {Colors, ThemeContext} from './Theme';

function Question({data, onPress, theme}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.listContentContainer,
        {
          backgroundColor: theme.grey.default,
        },
      ]}>
      <View style={styles.subjectContainer}>
        <Image
          source={require('../assets/book.icon.png')}
          style={styles.image}
        />
        <Text style={styles.subject}>{data.subject}</Text>
      </View>
      <Text style={[styles.text, {color: theme.text}]}>{data.question}</Text>
    </TouchableOpacity>
  );
}
function EmptyList({Theme}) {
  return (
    <View style={styles.emptyListContainer}>
      <Image
        source={require('../assets/empty.icon.png')}
        style={styles.emptyImage}
      />
      <Text style={[styles.text, {color: Theme.text}]}>
        لم تحفظ أي من الأسئلة
      </Text>
    </View>
  );
}

export default function Bookmarks({navigation, route, data}) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [dataIndex, setDataIndex] = React.useState(0);
  const {Theme} = React.useContext(ThemeContext);
  function open_question_modal(i) {
    setDataIndex(i);
    setModalVisible(true);
    return;
  }
  const {subject} = route.params;
  if (subject !== '') {
    data = data.filter(item => item.subject === subject);
  }
  return (
    <View style={[styles.container, {backgroundColor: Theme.background}]}>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        {data.length !== 0 ? (
          <View style={[styles.container, {backgroundColor: Theme.background}]}>
            <View style={styles.header}>
              <BackButton onPress={() => setModalVisible(false)} />
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.deleteButton}>
                <Text style={[styles.helperText, {color: Theme.text}]}>
                  إزالة من المحفوظات
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{height: '25%'}} />
            <View style={styles.questionContainer}>
              <Image
                source={require('../assets/info.icon.png')}
                style={[
                  styles.infoIcon,
                  {
                    tintColor: Colors.blue,
                  },
                ]}
              />
              <Text
                style={[
                  styles.question,
                  {color: Theme.text, marginBottom: 32},
                ]}>
                {data[dataIndex].question}
              </Text>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View
                style={[styles.card, {backgroundColor: Colors.green_light}]}>
                <Text style={[styles.text, {color: Colors.green}]}>
                  الإجابة الصحيحة
                </Text>
                <Text style={[styles.text, {color: Theme.text}]}>
                  {data[dataIndex].right_answer}
                </Text>
              </View>

              <View
                style={[styles.card, {backgroundColor: Theme.grey.default}]}>
                <Text style={[styles.text, {color: Theme.grey.accent_2}]}>
                  باقي الخيارات
                </Text>
                {data[dataIndex].choices
                  .filter(c => c !== data[dataIndex].right_answer)
                  .map((choice, index) => {
                    return (
                      <Text
                        key={index}
                        style={[styles.text, {color: Theme.text}]}>
                        • {choice}
                      </Text>
                    );
                  })}
              </View>
              {data[dataIndex].explanation.length > 3 ? (
                <View
                  style={[styles.card, {backgroundColor: Theme.grey.default}]}>
                  <Text style={[styles.text, {color: Theme.grey.accent_2}]}>
                    شرح السؤال
                  </Text>
                  <Text style={styles.text}>{data[dataIndex].explanation}</Text>
                </View>
              ) : null}
            </ScrollView>
          </View>
        ) : null}
      </Modal>

      <BackButton onPress={() => navigation.goBack()} />
      <View style={{height: '20%'}} />

      <Text style={[styles.title, {color: Theme.text}]}>
        {`المحفوظات${subject !== '' ? ': ' + subject : ''}`}
        <Text style={[styles.helperText, {color: Theme.grey.accent_2}]}>
          {'\n'}الأسئلة التي حفظتها
        </Text>
      </Text>
      <FlatList
        data={data}
        ListEmptyComponent={() => <EmptyList Theme={Theme} />}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <Question
            data={item}
            theme={Theme}
            onPress={() => open_question_modal(index)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontFamily: 'ReadexPro-Bold',
    fontSize: 20,
    marginRight: 16,
    marginBottom: 16,
  },
  listContentContainer: {
    borderRadius: 10,
    padding: 16,
    margin: 8,
  },
  helperText: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14,
  },
  subject: {
    fontFamily: 'ReadexPro-Bold',
    fontSize: 14,
    color: Colors.blue,
  },
  text: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 16,
    padding: 4,
  },
  modalView: {
    flex: 1,
    padding: 8,
  },
  card: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  subjectContainer: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    padding: 6,
  },
  image: {
    width: 16,
    height: 16,
    tintColor: Colors.blue,
    marginHorizontal: 4,
  },
  modalScroll: {
    padding: 8,
  },
  questionContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    padding: 8,
  },
  question: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 20,
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: Colors.red_light,
    height: 40,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    width: 80,
    height: 80,
  },
  emptyListContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  infoIcon: {
    height: 24,
    width: 24,
    padding: 4,
  },
});
