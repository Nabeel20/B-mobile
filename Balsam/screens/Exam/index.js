import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  useWindowDimensions,
  Animated,
  ScrollView,
} from 'react-native';
import Choice from './Choice';
import Spacer from './Elements/Spacer';
import Explanation from './Elements/Explanation';
import { ThemeContext } from '../Theme';
import Loading from '../components/Loading';
import Header from './Elements/Header';
import ExamModal from './Elements/ExamModal';
import { get_quiz } from '../../helper/api';
import ExamButton from './Elements/ExamButton';

function Exam({ route, navigation }) {
  const { Theme } = React.useContext(ThemeContext);
  const { quiz_rtl, quiz_title, quiz_subject, quiz_id, quiz_mcq } = route.params;

  const { width } = useWindowDimensions();
  const flatListRef = React.useRef(null);

  const QuizData = React.useRef([]);
  const [index, setIndex] = React.useState(0);

  const timer = React.useRef(false);
  const skip_mode = React.useRef(false);
  const skip_data = React.useRef([]);
  const direction = React.useRef('right');
  const correct = React.useRef(false);
  const progress_value = React.useRef(0);
  const correct_count = React.useRef(0);
  const preview = React.useRef(false);
  const status = React.useRef(true);

  const footer_animation = React.useRef(new Animated.Value(100)).current;
  const number_animation = React.useRef(new Animated.Value(100)).current;
  const explanation_animation = React.useRef(new Animated.Value(0)).current;
  const question_animation = React.useRef(new Animated.Value(100)).current;

  const [userChoice, setUserChoice] = React.useState('');
  const [isValid, setIsValid] = React.useState(false);
  const [navText, setNavText] = React.useState(
    quiz_mcq ? 'السؤال التالي' : 'إظهار الجواب',
  );
  const [modalType, setModalType] = React.useState(false);
  const [examModal, setExamModal] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let interval;
    if (timer) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 60000);
    } else if (!timer) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);
  React.useEffect(() => {
    timer.current = true;
    fetch_quiz_data(quiz_id);
  }, [quiz_id]);

  React.useEffect(() => {
    if (loading) { return; }
    flatListRef.current.scrollToIndex({
      index,
      viewOffset: 0,
      viewPosition: 0,
      animated: false,
    });
    function reset_data() {
      setIsValid(false);
      setUserChoice('');
      correct.current = false;
    }
    function update_text() {
      const on_last_item = index === QuizData.current.length - 1;
      if (on_last_item) {
        if (QuizData.current.every(q => q.review)) {
          setNavText('إظهار النتيجة');
          return;
        }
        setNavText('تخطي السؤال الأخير؟');
        return;
      }
      setNavText(quiz_mcq ? 'السؤال التالي' : 'إظهار الجواب');
    }

    function update_skipped_questions() {
      const user_data = QuizData.current[index].user_answer;
      if (user_data.length === 0) {
        if (skip_data.current.map(i => i.index_id).includes(index) === false) {
          skip_data.current = [
            ...skip_data.current,
            {
              index_id: index,
              done: false,
            },
          ];
        }
      }
      return;
    }

    update_skipped_questions();
    reset_data();
    update_text();
    play_explanation_animation();
    play_animation(question_animation, 400);
  }, [index]);

  async function fetch_quiz_data(id) {
    const quiz_data = await get_quiz(id);
    if (quiz_data.status === false) {
      return;
    }
    QuizData.current = quiz_data.data;
    console.log(quiz_data.data);
    setLoading(false);
    play_animation(question_animation, 400);
  }
  function play_explanation_animation() {
    const question_is_done = QuizData.current[index].review;
    const has_explanation = QuizData.current[index].explanation.length > 5;
    if (preview.current && has_explanation) {
      return play_animation(explanation_animation, 300);
    }
    if (question_is_done && has_explanation) {
      return play_animation(explanation_animation, 300);
    }
    explanation_animation.setValue(0);
  }
  function play_animation(animation, duration) {
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 100,
      duration,
      useNativeDriver: false,
    }).start();
  }
  function update_quiz_data() {
    QuizData.current[index].review = true;
    QuizData.current[index].user_answer = userChoice;
  }
  function update_skip_data() {
    if (skip_data.current.map(item => item.index_id).includes(index)) {
      let i = skip_data.current.map(item => item.index_id).indexOf(index);
      skip_data.current[i].done = true;
    }
  }
  function handle_press(c) {
    const _user_data = userChoice.length === 0;
    const _question_done = QuizData.current[index].review;
    if (isValid) {
      return;
    }
    if (_question_done) {
      return;
    }
    if (preview.current) {
      return;
    }
    setUserChoice(c);
    setNavText('التأكد من الإجابة');
    if (_user_data) { play_animation(footer_animation, 1100); }
  }
  function check_correct_input() {
    const _correct_answer = QuizData.current[index].right_answer;
    if (userChoice === _correct_answer) {
      correct_count.current += 1;
      correct.current = true;
    }
  }
  function validate() {
    const _question_done = QuizData.current[index].review;
    const _user_input = userChoice.length === 0;
    if (_question_done) {
      return;
    }
    if (_user_input) {
      return;
    }
    progress_value.current++;
    setIsValid(true);
    update_quiz_data();
    setNavText('السؤال التالي');
    update_skip_data();
    check_correct_input();
    play_explanation_animation();
    play_animation(footer_animation, 400);
  }
  function get_next_skip_index() {
    if (skip_mode.current === false) { return 0; }
    let _skip_data = skip_data.current;
    const _unsolved_data = _skip_data.filter(s => s.done === false);
    if (_unsolved_data.length === 1) { return _unsolved_data[0].index_id; }
    let bigger_indexes = [];
    let smaller_indexes = [];
    for (let i = 0; i < _skip_data.length; i++) {
      const element = _skip_data[i];
      if (element.index_id < index) {
        smaller_indexes.push(element);
      }
      if (element.index_id > index) {
        bigger_indexes.push(element);
      }
    }
    const output = [...bigger_indexes, ...smaller_indexes].filter(
      i => i.done === false,
    );
    if (output.length === 0) { return 0; }
    return output[0].index_id;
  }
  function handle_modal() {
    const on_last_index = index === QuizData.current.length - 1;
    const on_all_done = QuizData.current.every(question => question.review);
    const on_not_finished = skip_data.current.every(q => q.done) === false;
    if (on_all_done && !preview.current) {
      timer.current = false;
      setExamModal(true);
      setModalType('score');
      return;
    }
    if (on_last_index && preview.current) {
      timer.current = false;
      setExamModal(true);
      setModalType('score');
      return;
    }
    if (on_last_index && !skip_mode.current && on_not_finished) {
      timer.current = false;
      setExamModal(true);
      setModalType('skip');
      return;
    }
  }
  function handle_index() {
    const total = QuizData.current.length;
    let next_index = index + 1;
    let skip_index = get_next_skip_index();
    if (next_index === total) { next_index = total - 1; }
    setIndex(skip_mode.current ? skip_index : next_index);
  }
  function handle_next() {
    handle_modal();
    direction.current = 'right';
    play_animation(number_animation, 400);
    play_animation(footer_animation, 400);
    handle_index();
  }
  function handle_previous() {
    if (index === 0) { return; }
    const next_index = index - 1;
    direction.current = 'left';
    play_animation(number_animation, 500);
    setIndex(next_index);
  }
  function handle_next_button() {
    if (userChoice.length !== 0 && isValid === false) { return validate(); }
    handle_next();
  }
  function Question({ item }) {
    return (
      <Animated.View
        style={{
          width: width - 32,
          opacity: question_animation.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
          }),
          transform: [
            {
              translateY: question_animation.interpolate({
                inputRange: [0, 100],
                outputRange: [10, 0],
              }),
            },
          ],
        }}
        key={item.id}>
        <Spacer />
        <Text
          style={[
            styles.title,
            {
              color: Theme.text,
            },
          ]}>
          {item.question}
        </Text>
        <Spacer vertical={16} />
        {
          quiz_mcq ? (
            <View style={styles.mcqContainer}>
              {item.choices.map((choice, i) => {
                return (
                  <Choice
                    key={i}
                    dir={quiz_rtl}
                    data={choice}
                    prefix={i}
                    selectedChoice={userChoice}
                    validation={isValid}
                    review={item.review}
                    correctAnswer={item.right_answer}
                    userInput={item.user_answer}
                    handlePress={handle_press}
                  />
                );
              })}
            </View>
          ) : null
        }
        <Explanation
          rtl={quiz_rtl}
          animation={explanation_animation}
          text={item.explanation}
        />
      </Animated.View>
    );
  }
  function resume_quiz() {
    timer.current = true;
    skip_mode.current = true;
    const _next_index = get_next_skip_index();
    setIndex(_next_index);
    setExamModal(false);
    return;
  }
  function review_quiz() {
    skip_mode.current = false;
    preview.current = true;
    timer.current = false;
    setIndex(0);
    QuizData.current.map(question => {
      if (question.review === false) {
        question.review = true;
        question.user_answer = '';
      }
    });
    setExamModal(false);
  }
  function skip_to_score() {
    skip_mode.current = false;
    preview.current = false;
    timer.current = false;
    setModalType('score');
    setExamModal(true);
  }
  function show_answer() {
    const is_done = QuizData.current[index].review;
    setNavText('السؤال التالي');
    play_animation(footer_animation, 300);
    if (is_done) {
      handle_next();
    }
    QuizData.current[index].review = true;
    play_animation(explanation_animation, 300);
  }

  if (loading) {
    return (
      <Loading
        status={status.current}
        onPress={() => fetch_quiz_data(quiz_id)}
      />
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
      <ExamModal
        visible={examModal}
        type={modalType}
        details={{
          title: quiz_title,
          subject: quiz_subject,
          correct_num: correct_count.current,
          progress: (100 / QuizData.current.length) * correct_count.current,
          skipped_num: skip_data.current.filter(q => q.done === false).length,
          no_input:
            QuizData.current.filter(q => q.review === true).length === 0,
          time: time,
          total_num: QuizData.current.length,
        }}
        onPressPrimary={modalType === 'skip' ? resume_quiz : review_quiz}
        onPressSecondary={() =>
          modalType === 'skip' ? skip_to_score() : navigation.goBack()
        }
      />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={true}>
        <Header
          details={{
            title: quiz_title,
            subject: quiz_subject,
            rtl: quiz_rtl,
            direction: direction.current,
            total_num: QuizData.current.length,
            progress_step:
              (100 / QuizData.current.length) * progress_value.current,
            bookmark_id: QuizData.current[index]?.id,
            index: index,
            exit_point: skip_mode.current || preview.current,
            animation: number_animation,
          }}
          timer={
            <Text
              style={[
                styles.timerText,
                {
                  color: Theme.text,
                },
              ]}>
              <Text>{time}</Text> {time >= 3 ? 'دقائق' : 'دقيقة'}
            </Text>
          }
          onNavigation={() => navigation.goBack()}
          onClose={skip_to_score}
        />
        <Spacer />
        <FlatList
          initialNumToRender={1}
          horizontal
          getItemLayout={(data, index) => ({
            length: width,
            offset: (width - 32) * index,
            index,
          })}
          ref={flatListRef}
          data={QuizData.current}
          scrollEnabled={false}
          initialScrollIndex={index}
          pagingEnabled
          contentContainerStyle={styles.flatList}
          renderItem={Question}
        />
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            borderColor: Theme.grey.default,
          },
        ]}>
        {quiz_mcq ? (
          <>
            <ExamButton
              text={navText}
              textAnimation={footer_animation}
              onPress={handle_next_button}
              isCorrect={correct.current}
              isChecked={isValid}
              flex={3}
              main
            />
            <ExamButton
              text={`السـؤال ${'\n'} السابـق`}
              onPress={handle_previous}
              index={index}
              isPrevious
            />
          </>
        ) : (
          <ExamButton text={navText} main onPress={show_answer} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    padding: 2,
    marginHorizontal: 8,
    fontFamily: 'ReadexPro-Bold',
  },
  footer: {
    flexDirection: 'row',
    height: 80,
    marginHorizontal: 8,
    borderTopWidth: 2,
  },
  modalText: {
    fontSize: 18,
    fontFamily: 'ReadexPro-Regular',
    textAlign: 'center',
  },
  timerText: {
    fontSize: 13,
    fontFamily: 'ReadexPro-Regular',
  },
  interviewButtonContainer: {
    marginTop: -4,
    marginBottom: 4,
    borderTopWidth: 0,
  },
  mcqContainer: {
    width: 24,
    height: 24,
  },
  flatList: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
  },
});

export default Exam;
