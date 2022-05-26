import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import MetaData from './MetaData';
import Progress from './Progress';
import Spacer from '../Spacer';
import QuestionNumber from './QuestionNumber';
import BookmarksButton from './Bookmarks.button';
import BackButton from '../../../components/Back.button';
import {Colors} from '../../../Theme';

export default function Header({timer, details, onNavigation, onClose}) {
  const {
    title,
    subject,
    rtl,
    total_num,
    exit_point,
    progress_step,
    index,
    animation,
    direction,
    bookmark_id,
  } = details;
  return (
    <>
      <View style={styles.headerContainer}>
        <BackButton onPress={onNavigation} _style={{marginLeft: 8}} />
        <View
          style={[styles.header, {flexDirection: rtl ? 'row-reverse' : 'row'}]}>
          {exit_point ? (
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>الانتقال للنتيجة</Text>
            </TouchableOpacity>
          ) : (
            <MetaData title={title} subject={subject} />
          )}

          {timer}
        </View>
      </View>
      <Progress dir={rtl} step={progress_step} />
      <Spacer vertical={10} />

      <View style={[styles.row, {flexDirection: rtl ? 'row-reverse' : 'row'}]}>
        <QuestionNumber
          total={total_num}
          animation={animation}
          direction={direction}
          number={index + 1}
          RTL={rtl}
        />
        <BookmarksButton id={bookmark_id} />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
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
  button: {
    borderRadius: 10,
    padding: 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red_light,
  },
  buttonText: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14,
  },
});
