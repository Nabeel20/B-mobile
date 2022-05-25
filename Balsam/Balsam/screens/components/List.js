import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import Arrow from '../../assets/arrow.png';
import StarsIcon from '../../assets/starsIcon.png';
import {ThemeContext, Colors} from '../Theme';

function EmptyList({onPress, theme}) {
  return (
    <View>
      <Text style={[styles.list_empty_title, {color: theme.text}]}>
        لا نتائج لعملية البحث
      </Text>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.list_empty_button,
          {
            backgroundColor: theme.grey.default,
          },
        ]}>
        <Text style={[styles.list_empty_text, {color: theme.grey.accent_2}]}>
          جرّب مرة أخرى{' '}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function Card({
  title,
  details,
  has_updates,
  theme,
  onHome,
  number,
  onPress,
  show_numbers,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: theme.grey.default,
          borderColor: theme.grey.default,
        },
      ]}>
      <View>
        <Text style={[styles.title, {color: theme.text}]}>{title}</Text>
        {onHome && has_updates ? (
          <View style={styles.update}>
            <Text style={[styles.subTitle, {color: theme.grey.accent_2}]}>
              <Text style={{color: Colors.red}}>جديد</Text> {details}
            </Text>
            <Image
              source={{uri: StarsIcon}}
              style={[{width: 18, height: 18, tintColor: Colors.red}]}
            />
          </View>
        ) : null}
        {show_numbers ? (
          <Text style={[styles.subTitle, {color: theme.grey.accent_2}]}>
            {number} سؤال
          </Text>
        ) : null}
      </View>
      <Image
        source={{uri: Arrow}}
        style={[styles.arrowIcon, {tintColor: theme.text}]}
      />
    </TouchableOpacity>
  );
}

export default function SubjectList({
  data,
  keywords,
  onPress,
  onClear,
  animation,
  onHome = true,
}) {
  if (keywords === undefined) {
    keywords = '';
  }
  if (keywords !== '') {
    let output = [];
    for (let index = 0; index < data.length; index++) {
      const _category = data[index];
      const _title = _category.title;
      const _quizzes = _category.quizzes;
      if (_title.includes(keywords)) {
        output.push(_category);
      }
      for (let i = 0; i < _quizzes.length; i++) {
        let previous_output = output.map(e => e.title);
        if (
          _quizzes[i].title.includes(keywords) &&
          previous_output.includes(_quizzes[i].title) === false
        ) {
          output.push(_quizzes[i]);
        }
      }
    }
    data = output;
  }

  const {Theme} = React.useContext(ThemeContext);
  let _header = keywords !== 0 && data.length !== 0 && onHome;
  return (
    <Animated.View
      style={{
        opacity: animation.interpolate({
          inputRange: [0, 100],
          outputRange: [0, 1],
        }),
        flex: 1,
      }}>
      {_header ? (
        <Text style={[styles.list_title, {color: Theme.grey.accent_2}]}>
          {keywords === '' ? 'المقررات' : 'نتائج البحث'}
        </Text>
      ) : null}

      <FlatList
        data={data}
        ListEmptyComponent={<EmptyList onPress={onClear} theme={Theme} />}
        keyExtractor={item => item.id}
        renderItem={({
          item: {
            title,
            has_updates = false,
            details,
            quizzes,
            category,
            rtl,
            mcq,
            branch,
            url,
            number,
          },
        }) => (
          <Card
            onPress={() => {
              let props =
                category === undefined
                  ? {title, list: quizzes}
                  : {title, subject: category, rtl, mcq, url, branch};
              onPress(props);
            }}
            title={title}
            details={details}
            has_updates={has_updates}
            onHome={onHome}
            number={number}
            theme={Theme}
            show_numbers={category !== undefined}
          />
        )}
      />
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  list_title: {
    fontSize: 14,
    fontFamily: 'readex pro',
    fontWeight: '400',
    marginRight: -4,
    marginBottom: 8,
  },
  container: {
    borderRadius: 10,
    padding: 14,
    margin: 8,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
  },
  title: {
    fontFamily: 'readex pro',
    fontSize: 16,
    fontWeight: '500',
    padding: 4,
    textAlign: 'right',
  },
  list_empty_title: {
    fontFamily: 'readex pro',
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 8,
    fontSize: 18,
  },
  list_empty_text: {
    fontFamily: 'readex pro',
    alignSelf: 'center',
    fontSize: 14,
  },
  list_empty_button: {
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
    alignSelf: 'center',
  },
  subTitle: {
    fontFamily: 'readex pro',
    fontSize: 14,
    marginTop: 4,
  },
  update: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
});
