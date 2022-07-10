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
  const {quiz_rtl, quiz_title, quiz_id, quiz_mcq} = route.params;

  const {width} = useWindowDimensions();
  const flatListRef = React.useRef(null);

  const QuizData = React.useRef([]);
  const [quizIndex, setQuizIndex] = React.useState(0);
  const [bookmarks, updateBookmarks] = React.useState([]);
  const [timer, set_timer] = React.useState(false);
  const [skip_mode, set_skip_mode] = React.useState(false);
  const [skipped_questions, update_skipped_questions] = React.useState([]);
  const direction = React.useRef('right');
  const is_user_answer_correct = React.useRef(false);
  const progress_value = React.useRef(0);
  const correct_count = React.useRef(0);

  const footer_animation = React.useRef(new Animated.Value(100)).current;
  const number_animation = React.useRef(new Animated.Value(100)).current;
  const explanation_animation = React.useRef(new Animated.Value(0)).current;
  const question_animation = React.useRef(new Animated.Value(100)).current;

  const [selected_choice, update_selected_choice] = React.useState('');
  const [selected_choice_checked, set_selected_choice_checked] =
    React.useState(false);
  const [footer_text, set_footer_text] = React.useState(
    quiz_mcq ? 'السؤال التالي' : 'إظهار الجواب',
  );
  const [skip_modal, set_skip_modal] = React.useState(false);
  const [score_modal, set_score_modal] = React.useState(false);
  const [exit_modal, set_exit_modal] = React.useState(false);

  const [time, setTime] = React.useState(0);
  const [loading, set_loading] = React.useState(true);

  const [scrollView_height, set_scrollView_height] = React.useState(0);
  const questions_dimensions = React.useRef([]);
  const scrollView_ref = React.useRef(null);
  const exit_event_ref = React.useRef(null);

  const Question = function ({item}) {
    return (
      <Animated.View
        onLayout={({nativeEvent: LayoutEvent}) => {
          questions_dimensions.current = [
            ...questions_dimensions.current,
            LayoutEvent.layout.height,
          ];
        }}
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
                  rtl={quiz_rtl}
                  choice={choice}
                  prefix={i}
                  selectedChoice={selected_choice}
                  checked={selected_choice_checked}
                  done={item.done}
                  correctAnswer={item.correct_answer}
                  user_choice={item.user_answer}
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
  };

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
    set_timer(true);
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
          id,
        ] = data[index].split(',');
        const choices = shuffle(
          [choice1, choice2, choice3, choice4, choice5]
            .map(c => c.replace(/"/g, ''))
            .filter(c => c !== '-'),
        );
        output.push({
          question: question.replace(/"/g, ''),
          choices,
          correct_answer: choice1.replace(/"/g, ''),
          done: false,
          explanation: explanation.replace(/"/g, ''),
          user_answer: '',
          id: id.replace(/"/g, ''),
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
          set_loading(false);
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
      index: quizIndex,
      viewOffset: 0,
      viewPosition: 0,
      animated: false,
    });
    function reset_data() {
      set_selected_choice_checked(false);
      update_selected_choice('');
      is_user_answer_correct.current = false;
    }
    function update_text() {
      const on_last_item = quizIndex === QuizData.current.length - 1;
      if (on_last_item) {
        if (QuizData.current.every(q => q.done)) {
          set_footer_text('إظهار النتيجة');
          return;
        }
        set_footer_text('تخطي السؤال الأخير؟');
        return;
      }
      set_footer_text(quiz_mcq ? 'السؤال التالي' : 'إظهار الجواب');
    }

    add_to_skipped_questions();
    reset_data();
    update_text();
    play_explanation_animation();
    scrollView_ref.current?.scrollTo({y: 0, animated: false});
    play_animation(question_animation, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizIndex]);
  React.useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      exit_event_ref.current = e.data.action;
      if (
        progress_value.current === 0 ||
        QuizData.current.every(q => q.done === true) ||
        exit_modal
      ) {
        return;
      }
      e.preventDefault();
      set_exit_modal(true);
    });
  }, [navigation, exit_modal]);

  function play_explanation_animation() {
    const question_is_done = QuizData.current[quizIndex].done;
    const has_explanation = QuizData.current[quizIndex].explanation.length > 5;
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
      useNativeDriver: true,
    }).start();
  }

  function add_to_skipped_questions() {
    if (
      QuizData.current[quizIndex].done === false &&
      skipped_questions.includes(quizIndex) === false
    ) {
      update_skipped_questions([...new Set([...skipped_questions, quizIndex])]);
    }
    return;
  }

  function handle_press(choice) {
    if (selected_choice_checked) {
      return;
    }
    if (QuizData.current[quizIndex].done) {
      return;
    }
    update_selected_choice(choice);
    set_footer_text('التأكد من الإجابة');
    if (selected_choice.length === 0) {
      play_animation(footer_animation, 400);
    }
  }

  function validate() {
    if (QuizData.current[quizIndex].done) {
      return;
    }
    if (selected_choice.length === 0) {
      return;
    }
    function check_answer() {
      const _correct_answer = QuizData.current[quizIndex].correct_answer;
      if (selected_choice === _correct_answer) {
        correct_count.current += 1;
        is_user_answer_correct.current = true;
      }
    }
    function update_QuizData() {
      QuizData.current[quizIndex].done = true;
      QuizData.current[quizIndex].user_answer = selected_choice;
    }

    progress_value.current++;
    update_QuizData();
    if (skipped_questions.includes(quizIndex)) {
      update_skipped_questions(
        skipped_questions.filter(item => item !== quizIndex),
      );
    }
    check_answer();
    set_selected_choice_checked(true);
    set_footer_text('السؤال التالي');
    play_explanation_animation();
    play_animation(footer_animation, 400);
  }

  function update_index() {
    function next_skip_index() {
      if (skip_mode === false) {
        return 0;
      }

      if (skipped_questions.length === 1) {
        return skipped_questions[0];
      }
      let bigger_indexes = [];
      let smaller_indexes = [];
      for (let i = 0; i < skipped_questions.length; i++) {
        const element = skipped_questions[i];
        if (element < quizIndex) {
          smaller_indexes.push(element);
        }
        if (element > quizIndex) {
          bigger_indexes.push(element);
        }
      }
      const output = [...bigger_indexes, ...smaller_indexes];
      if (output.length === 0) {
        return 0;
      }
      return output[0];
    }
    const total = QuizData.current.length;
    let next_index = quizIndex + 1;
    let skip_index = next_skip_index();
    if (next_index === total) {
      next_index = total - 1;
    }
    setQuizIndex(skip_mode ? skip_index : next_index);
  }
  function next_question() {
    direction.current = 'right';
    play_animation(number_animation, 400);
    play_animation(footer_animation, 400);
    update_index();
  }
  function previous_question() {
    if (quizIndex === 0) {
      return;
    }
    const next_index = quizIndex - 1;
    direction.current = 'left';
    play_animation(number_animation, 500);
    setQuizIndex(next_index);
  }
  function handle_footer() {
    if (selected_choice.length !== 0 && selected_choice_checked === false) {
      return validate();
    }
    if (quizIndex === 0) {
      add_to_skipped_questions();
    }
    function handle_modal() {
      const on_last_question = quizIndex === QuizData.current.length - 1;
      const all_questions_done = QuizData.current.every(
        question => question.done,
      );
      if (all_questions_done && skip_mode) {
        set_score_modal(true);
        return;
      }
      if (on_last_question && all_questions_done) {
        set_score_modal(true);
        return;
      }
      if (
        on_last_question &&
        skipped_questions.length > 0 &&
        skip_mode === false
      ) {
        set_skip_modal(true);
        return;
      }
    }
    handle_modal();
    next_question();
  }

  function resume_quiz() {
    set_timer(true);
    set_skip_mode(true);
    setQuizIndex(skipped_questions[0] === undefined ? 0 : skipped_questions[0]);
    set_skip_modal(false);
    return;
  }
  function review_quiz() {
    set_skip_mode(false);
    set_timer(false);
    setQuizIndex(0);
    QuizData.current.map(question => {
      if (question.done === false) {
        question.done = true;
        question.user_answer = '';
      }
    });
    set_score_modal(false);
  }
  function skip_to_score() {
    set_skip_mode(false);
    set_timer(false);
    set_skip_modal(false);
    set_score_modal(true);
  }
  function interview_question() {
    // refactor
    set_footer_text('السؤال التالي');
    play_animation(footer_animation, 300);
    if (QuizData.current[quizIndex].done) {
      return next_question();
    }
    QuizData.current[quizIndex].done = true;
    play_animation(explanation_animation, 300);
  }
  function add_to_bookmarks() {
    return;
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
        visible={exit_modal}
        details={{
          title: '?هل تود المغادرة',
          sub_title: 'لم تنته بعد من الامتحان',
          correct_answers_number: 0,
          skipped_questions_number: 0,
          questions_number: 0,
          no_user_input: false,
          time,
        }}
        buttons={[
          {
            text: 'leave quiz',
            color: 'red',
          },
          {
            text: 'continue',
            color: undefined,
          },
        ]}
        onPress={[
          () => {
            navigation.dispatch(exit_event_ref.current);
          },
          () => set_exit_modal(false),
        ]}
        onRequestClose={() => navigation.goBack()}
      />
      <ExamModal
        visible={skip_modal}
        details={{
          title: 'الخطوة التالية؟',
          sub_title: `تجاوزت ${skipped_questions.length} من الأسئلة`,
          correct_answers_number: 0,
          skipped_questions_number: skipped_questions.length,
          questions_number: 0,
          no_user_input: false,
          time,
        }}
        buttons={[
          {text: 'حل الباقي', color: 'blue'},
          {text: 'انتقل للنتيجة', color: undefined},
        ]}
        onPress={[resume_quiz, skip_to_score]}
        onRequestClose={() => navigation.goBack()}
      />
      <ExamModal
        visible={score_modal}
        details={{
          title: 'الله يعطيك العافية',
          sub_title: '',
          correct_answers_number: correct_count.current,
          skipped_questions_number: skipped_questions.length,
          questions_number: QuizData.current.length,
          no_user_input: QuizData.current.every(q => q.done === false),
          time,
        }}
        buttons={[
          {
            text: 'راجع الأسئلة',
            color: undefined,
          },
        ]}
        onPress={[review_quiz]}
        exitButton
        onRequestClose={() => navigation.goBack()}
      />

      <Header
        details={{
          quiz_title,
          quiz_rtl,
          direction: direction.current,
          questions_number: QuizData.current.length,
          progress_step:
            (100 / QuizData.current.length) * progress_value.current,
          current_index: quizIndex,
          exit_point: skip_mode,
          number_animation,
          bookmark_status: bookmarks
            .map(b => b.id)
            .includes(QuizData.current[quizIndex].id),
          time: time,
        }}
        onNavigation={() => navigation.goBack()}
        onClose={skip_to_score}
        onBookmark={add_to_bookmarks}
      />

      <ScrollView
        ref={scrollView_ref}
        contentContainerStyle={styles.scrollView}
        onLayout={({nativeEvent: LayoutEvent}) =>
          set_scrollView_height(LayoutEvent.layout.height)
        }
        scrollEnabled={
          questions_dimensions.current[quizIndex] > scrollView_height
        }
        showsVerticalScrollIndicator={true}>
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
          showsHorizontalScrollIndicator={false}
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
              text={footer_text}
              textAnimation={footer_animation}
              onPress={handle_footer}
              isCorrect={is_user_answer_correct}
              isChecked={selected_choice_checked}
              onChoose={
                selected_choice.length !== 0 &&
                selected_choice_checked === false
              }
              flex={3}
              main
            />
            <ExamButton
              text={`السـؤال ${'\n'} السابـق`}
              onPress={previous_question}
              index={quizIndex}
              isPrevious
            />
          </>
        ) : (
          <ExamButton text={footer_text} main onPress={interview_question} />
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
  flatList: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
    paddingTop: 0,
  },
});

export default Exam;
