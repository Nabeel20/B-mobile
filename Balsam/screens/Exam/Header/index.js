import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import Progress from './Progress';
import Number from './Number';
import BackButton from '../../components/Back.button';
import {Colors, ThemeContext} from '../../Theme';

export default function Header({details, onNavigation, onClose, onBookmark}) {
  const {
    quiz_title,
    quiz_rtl,
    direction,
    questions_number,
    progress_step,
    current_index,
    exit_point,
    number_animation,
    bookmark_status,
    time,
  } = details;
  const {Theme, Button, Text} = React.useContext(ThemeContext);
  return (
    <View style={styles.main_container}>
      <View style={styles.headerContainer}>
        <BackButton onPress={onNavigation} />
        <View
          style={[
            styles.header,
            // eslint-disable-next-line react-native/no-inline-styles
            {flexDirection: quiz_rtl ? 'row-reverse' : 'row'},
          ]}>
          {exit_point ? (
            <Button color="red" onPress={onClose} style={styles.exit_button}>
              <Text style={styles.exit_button_text}>الانتقال للنتيجة</Text>
            </Button>
          ) : (
            <Text secondary type="medium" style={styles.title}>
              {quiz_title}
            </Text>
          )}
          <Text>
            {time} {time >= 3 ? 'دقائق' : 'دقيقة'}
          </Text>
        </View>
      </View>
      <Progress rtl={quiz_rtl} step={progress_step} />
      <View style={styles.spacer} />
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.row, {flexDirection: quiz_rtl ? 'row-reverse' : 'row'}]}>
        <Number
          total={questions_number}
          animation={number_animation}
          direction={direction}
          index={current_index + 1}
          rtl={quiz_rtl}
        />
        <Button style={styles.bookmark_button} onPress={onBookmark}>
          <Image
            source={
              bookmark_status
                ? require('../../../assets/bookmark-icon-fill.png')
                : require('../../../assets/bookmark-icon.png')
            }
            style={[styles.bookmark_icon, {tintColor: Theme.text}]}
          />
        </Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  main_container: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row-reverse',
    marginBottom: 8,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exit_button: {
    borderRadius: 10,
    padding: 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exit_button_text: {
    color: '#212121',
  },
  spacer: {
    height: 10,
  },
  bookmark_button: {
    borderRadius: 6,
    padding: 5,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmark_icon: {
    width: 24,
    height: 24,
  },
});
