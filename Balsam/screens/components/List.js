import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Animated,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {ThemeContext, Colors} from '../Theme';

function EmptyList({theme}) {
  return (
    <View>
      <Text style={[styles.list_empty_title, {color: theme.text}]}>
        جار التحميل
      </Text>
      <ActivityIndicator size="small" color={theme.text} />
    </View>
  );
}
function Icon({type, color}) {
  const icons = {
    stars: require('../../assets/stars.icon.png'),
    recommend: require('../../assets/recommended.icon.png'),
  };

  return (
    <Image source={icons[type]} style={[styles.icon, {tintColor: color}]} />
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
  editorChoice = false,
  done = false,
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
        <View style={styles.title_container}>
          {done ? (
            <Image
              source={require('../../assets/check.icon.png')}
              style={[styles.done_icon, {tintColor: theme.text}]}
            />
          ) : null}
          <Text style={[styles.title, {color: theme.text}]}>{title}</Text>
        </View>
        {[has_updates, editorChoice, show_numbers].every(
          condition => condition === false,
        ) ? null : (
          <View style={styles.icons_container}>
            {has_updates ? (
              <View style={styles.update}>
                <Text style={[styles.subTitle, {color: theme.grey.accent_2}]}>
                  <Text style={{color: Colors.red}}>جديد</Text> {details}
                </Text>
                <Icon type="stars" color={Colors.red} />
              </View>
            ) : null}
            {show_numbers ? (
              <Text style={[styles.subTitle, {color: theme.grey.accent_2}]}>
                {number} سؤال
              </Text>
            ) : null}
            {editorChoice ? (
              <View style={styles.recommend_container}>
                <Text style={[styles.subTitle, {color: Colors.green}]}>
                  نصيحة
                </Text>
                <Icon icon="recommended" color={Colors.green} />
              </View>
            ) : null}
          </View>
        )}
      </View>
      <Image
        source={require('../../assets/arrow.icon.png')}
        style={[styles.arrowIcon, {tintColor: theme.text}]}
      />
    </TouchableOpacity>
  );
}

export default function List({data, onPress, animation, finishedIDs = []}) {
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
            id,
            editor_choice = false,
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
            done={finishedIDs.includes(id)}
            editorChoice={editor_choice}
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
    paddingBottom: 2,
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
  },
  update: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
  icon: {
    width: 18,
    height: 18,
    marginLeft: 4,
  },
  list_texts: {
    alignItems: 'flex-end',
  },
  icons_container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 4,
  },
  recommend_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  title_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  done_icon: {
    width: 20,
    height: 20,
  },
});
