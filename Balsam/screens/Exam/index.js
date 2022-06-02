import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  useWindowDimensions,
  Animated,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import Choice from './Choice';
import Spacer from './Elements/Spacer';
import Explanation from './Elements/Explanation';
import Loading from '../components/Loading';
import Header from './Elements/Header';
import ExamModal from './Elements/ExamModal';
import ExamButton from './Elements/ExamButton';
import {ThemeContext} from '../Theme';

function Exam({route, navigation}) {
  const {Theme} = React.useContext(ThemeContext);
  const {quiz_rtl, quiz_title, quiz_subject, quiz_id, quiz_mcq} = route.params;

  const {width} = useWindowDimensions();
  const flatListRef = React.useRef(null);

  const QuizData = React.useRef([]);
  const [quizIndex, setQuizIndex] = React.useState(0);

  const timer = React.useRef(false);
  const skip_mode = React.useRef(false);
  const skip_data = React.useRef([]);
  const direction = React.useRef('right');
  const correct = React.useRef(false);
  const progress_value = React.useRef(0);
  const correct_count = React.useRef(0);
  const preview = React.useRef(false);

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
    function get_quiz_json(data) {
      data = data.split('\n');
      let output = [];
      for (let index = 1; index < data.length; index++) {
        const [
          question,
          choice1,
          choice2,
          choice3,
          choice4,
          choice5,
          explanation,
        ] = data[index].split(',');
        const choices = shuffle(
          [choice1, choice2, choice3, choice4, choice5]
            .map(c => c.replace(/"/g, ''))
            .filter(c => c !== '-'),
        );
        output.push({
          question: question.replace(/"/g, ''),
          choices,
          right_answer: choice1.replace(/"/g, ''),
          review: false,
          explanation: explanation.replace(/"/g, ''),
          user_answer: '',
          id: generate_unique_id(),
        });
      }
      return shuffle(output);
    }
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    }
    function generate_unique_id() {
      function chr4() {
        return Math.random().toString(16).slice(-4);
      }
      return (
        chr4() +
        chr4() +
        '-' +
        chr4() +
        '-' +
        chr4() +
        '-' +
        chr4() +
        '-' +
        chr4()
      );
    }
    try {
      if (typeof quiz_id !== 'string') {
        return;
      }
      fetch(
        `https://docs.google.com/spreadsheets/d/${quiz_id}/export?format=csv`,
      )
        .then(res => res.text())
        .then(data => {
          let quiz_data = get_quiz_json(data);
          QuizData.current = quiz_data;
          setLoading(false);
          play_animation(question_animation, 400);
        });
    } catch (error) {
      ToastAndroid.show(JSON.stringify(error), ToastAndroid.LONG);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz_id]);

  React.useEffect(() => {
    if (loading || QuizData.current.length === 0) {
      return;
    }
    flatListRef.current.scrollToIndex({
      quizIndex,
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
      const on_last_item = quizIndex === QuizData.current.length - 1;
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
      const user_data = QuizData.current[quizIndex].user_answer;
      if (user_data.length === 0) {
        if (
          skip_data.current.map(i => i.index_id).includes(quizIndex) === false
        ) {
          skip_data.current = [
            ...skip_data.current,
            {
              index_id: quizIndex,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizIndex]);

  function play_explanation_animation() {
    const question_is_done = QuizData.current[quizIndex].review;
    const has_explanation = QuizData.current[quizIndex].explanation.length > 5;
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
    QuizData.current[quizIndex].review = true;
    QuizData.current[quizIndex].user_answer = userChoice;
  }
  function update_skip_data() {
    if (skip_data.current.map(item => item.index_id).includes(quizIndex)) {
      let i = skip_data.current.map(item => item.index_id).indexOf(quizIndex);
      skip_data.current[i].done = true;
    }
  }
  function handle_press(c) {
    const _user_data = userChoice.length === 0;
    const _question_done = QuizData.current[quizIndex].review;
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
    if (_user_data) {
      play_animation(footer_animation, 1100);
    }
  }
  function check_correct_input() {
    const _correct_answer = QuizData.current[quizIndex].right_answer;
    if (userChoice === _correct_answer) {
      correct_count.current += 1;
      correct.current = true;
    }
  }
  function validate() {
    const _question_done = QuizData.current[quizIndex].review;
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
    if (skip_mode.current === false) {
      return 0;
    }
    let _skip_data = skip_data.current;
    const _unsolved_data = _skip_data.filter(s => s.done === false);
    if (_unsolved_data.length === 1) {
      return _unsolved_data[0].index_id;
    }
    let bigger_indexes = [];
    let smaller_indexes = [];
    for (let i = 0; i < _skip_data.length; i++) {
      const element = _skip_data[i];
      if (element.index_id < quizIndex) {
        smaller_indexes.push(element);
      }
      if (element.index_id > quizIndex) {
        bigger_indexes.push(element);
      }
    }
    const output = [...bigger_indexes, ...smaller_indexes].filter(
      i => i.done === false,
    );
    if (output.length === 0) {
      return 0;
    }
    return output[0].index_id;
  }
  function handle_modal() {
    const on_last_index = quizIndex === QuizData.current.length - 1;
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
    let next_index = quizIndex + 1;
    let skip_index = get_next_skip_index();
    if (next_index === total) {
      next_index = total - 1;
    }
    setQuizIndex(skip_mode.current ? skip_index : next_index);
  }
  function handle_next() {
    handle_modal();
    direction.current = 'right';
    play_animation(number_animation, 400);
    play_animation(footer_animation, 400);
    handle_index();
  }
  function handle_previous() {
    if (quizIndex === 0) {
      return;
    }
    const next_index = quizIndex - 1;
    direction.current = 'left';
    play_animation(number_animation, 500);
    setQuizIndex(next_index);
  }
  function handle_next_button() {
    if (userChoice.length !== 0 && isValid === false) {
      return validate();
    }
    handle_next();
  }
  function Question({item}) {
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
        {quiz_mcq ? (
          <View>
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
        ) : null}
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
    setQuizIndex(_next_index);
    setExamModal(false);
    return;
  }
  function review_quiz() {
    skip_mode.current = false;
    preview.current = true;
    timer.current = false;
    setQuizIndex(0);
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
    const is_done = QuizData.current[quizIndex].review;
    setNavText('السؤال التالي');
    play_animation(footer_animation, 300);
    if (is_done) {
      handle_next();
    }
    QuizData.current[quizIndex].review = true;
    play_animation(explanation_animation, 300);
  }

  if (loading) {
    return <Loading />;
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
            bookmark_id: QuizData.current[quizIndex]?.id,
            index: quizIndex,
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
          initialScrollIndex={quizIndex}
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
              index={quizIndex}
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
  flatList: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
  },
});

export default Exam;
