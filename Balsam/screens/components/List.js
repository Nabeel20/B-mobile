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
import {ThemeContext, Colors} from '../Theme';

function EmptyList({theme}) {
  return (
    <Text style={[styles.list_empty_title, {color: theme.text}]}>
      جار التحميل
    </Text>
  );
}

function Card({
  title,
  details,
  has_updates = false,
  theme,
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
        },
      ]}>
      <View style={styles.list_texts}>
        <Text style={[styles.title, {color: theme.text}]}>{title}</Text>
        {has_updates ? (
          <View style={styles.update}>
            <Text style={[styles.subTitle, {color: theme.grey.accent_2}]}>
              <Text style={{color: Colors.red}}>جديد</Text> {details}
            </Text>
            <Image
              source={require('../../assets/starsIcon.png')}
              style={[styles.starsIcon, {tintColor: Colors.red}]}
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
        source={require('../../assets/arrow.png')}
        style={[styles.arrowIcon, {tintColor: theme.text}]}
      />
    </TouchableOpacity>
  );
}

export default function SubjectList({data, onPress, animation}) {
  const {Theme} = React.useContext(ThemeContext);

  return (
    <Animated.View
      style={[
        styles.main,
        {
          opacity: animation.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
          }),
        },
      ]}>
      <FlatList
        data={data}
        ListEmptyComponent={<EmptyList theme={Theme} />}
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
  main: {
    flex: 1,
  },
  container: {
    borderRadius: 10,
    padding: 14,
    margin: 8,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 16,
    padding: 4,
    textAlign: 'right',
  },
  list_empty_title: {
    fontFamily: 'ReadexPro-Regular',
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 8,
    fontSize: 18,
  },
  list_empty_text: {
    fontFamily: 'ReadexPro-Regular',
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
    fontFamily: 'ReadexPro-Regular',
    fontSize: 12,
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
  starsIcon: {
    width: 18,
    height: 18,
  },
  list_texts: {
    alignItems: 'flex-end',
  },
});
