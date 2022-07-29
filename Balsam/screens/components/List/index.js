import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  Image,
  ActivityIndicator,
} from 'react-native';
import {ThemeContext, Colors} from '../../Theme';

const ICONS_LIST = {
  stars: require('./icons/stars-icon.png'),
  recommend: require('./icons/recommend-icon.png'),
  done: require('./icons/done-icon.png'),
  critical_care: require('./icons/specialties/critical_care.png'),
  cardiology: require('./icons/specialties/cardiology.png'),
  ears_nose_and_throat: require('./icons/specialties/ears_nose_and_throat.png'),
  endocrinology: require('./icons/specialties/endocrinology.png'),
  gastroenterology: require('./icons/specialties/gastroenterology.png'),
  geriatrics: require('./icons/specialties/geriatrics.png'),
  gynecology: require('./icons/specialties/gynecology.png'),
  hematology: require('./icons/specialties/hematology.png'),
  intensive_care_unit: require('./icons/specialties/intensive_care_unit.png'),
  nephrology: require('./icons/specialties/nephrology.png'),
  obstetricsmonia: require('./icons/specialties/obstetricsmonia.png'),
  oncology: require('./icons/specialties/oncology.png'),
  OSCE: require('./icons/specialties/OSCE.png'),
  opthalmology: require('./icons/specialties/opthalmology.png'),
  pediatrics: require('./icons/specialties/pediatrics.png'),
  pharmacy: require('./icons/specialties/pharmacy.png'),
  psychology: require('./icons/specialties/psychology.png'),
  radiology: require('./icons/specialties/radiology.png'),
  respirology: require('./icons/specialties/respirology.png'),
  rheumatology: require('./icons/specialties/rheumatology.png'),
  accident_and_emergency: require('./icons/specialties/accident_and_emergency.png'),
  anatomy: require('./icons/specialties/anatomy.png'),
};
function Icon({icon, color, style}) {
  const icon_colors = {
    red: Colors.red,
    green: Colors.green,
  };
  let tintColor = icon_colors[color] ?? color;
  if (ICONS_LIST[icon] === undefined) {
    return null;
  }
  return (
    <Image
      source={ICONS_LIST[icon]}
      style={[styles.icon, {tintColor}, style]}
    />
  );
}
function List({data, doneIds = [], onPress, onHome}) {
  const list_animation = React.useRef(new Animated.Value(100)).current;
  const {Theme, Button, Text} = React.useContext(ThemeContext);
  React.useEffect(() => {
    if (data.length === 0) {
      return;
    }
    list_animation.setValue(0);
    Animated.timing(list_animation, {
      toValue: 100,
      duration: 500,
      delay: 50,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const EmptyList = function () {
    return (
      <View style={styles.empty_state}>
        <Image
          source={require('../../../assets/empty-list-icon.png')}
          style={styles.empty_state_icon}
        />
        <Text style={styles.empty_state_text}>لسبب ما.. لا يوجد ملفات</Text>
        <ActivityIndicator size="small" color={Theme.text} />
      </View>
    );
  };
  const Tag = function ({color, text = '', icon = false}) {
    return (
      <View style={styles.row}>
        <Text
          style={styles.sub_title}
          color={color === 'green' ? 'green' : 'grey-dark'}>
          {icon === 'stars' ? <Text color="red">جديد</Text> : null} {text}
        </Text>
        {icon ? <Icon icon={icon} color={color} /> : null}
      </View>
    );
  };
  const Card = function ({item}) {
    const {
      title,
      has_updates = false,
      details,
      is_new,
      rtl,
      mcq,
      branch,
      url,
      number,
      id,
      icon = '',
      editor_choice = false,
    } = item;
    const title_done = doneIds.length > 0 ? doneIds.includes(id) : false;

    return (
      <Button
        onPress={() => onPress({title, rtl, mcq, url, branch})}
        style={styles.card}>
        {onHome ? (
          <Icon style={styles.category_icon} icon={icon} color={Theme.text} />
        ) : null}
        <View style={styles.text_container}>
          <View style={styles.title_container}>
            {title_done ? <Icon icon="done" color={Theme.text} /> : null}
            <Text weight="medium" style={styles.title}>
              {title}
            </Text>
          </View>
          <View style={styles.row}>
            {editor_choice && onHome === false ? (
              <Tag icon="recommend" text="نصيحة" color="green" />
            ) : null}
            {onHome ? null : (
              <Text color="grey-dark" style={styles.sub_title}>
                {number} سؤال
              </Text>
            )}
            {has_updates && onHome ? (
              <Tag icon="stars" text={details} color="red" />
            ) : null}
            {is_new ? <Tag icon="stars" color="red" /> : null}
          </View>
        </View>
        <Image
          source={require('../../../assets/arrow-icon.png')}
          style={[styles.arrow_icon, {tintColor: Theme.text}]}
        />
      </Button>
    );
  };

  return (
    <Animated.View
      style={[
        {
          opacity: list_animation.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 100],
          }),
          transform: [
            {
              translateY: list_animation.interpolate({
                inputRange: [0, 100],
                outputRange: [10, 0],
              }),
            },
          ],
        },
        styles.container,
      ]}>
      <FlatList
        contentContainerStyle={styles.container}
        data={data}
        ListEmptyComponent={EmptyList}
        keyExtractor={item => item.id}
        renderItem={Card}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty_state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty_state_text: {
    fontSize: 18,
    margin: 16,
    alignSelf: 'center',
  },
  empty_state_icon: {
    height: 72,
    width: 72,
    alignSelf: 'center',
  },
  card: {
    borderRadius: 10,
    padding: 14,
    margin: 8,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  arrow_icon: {
    height: 24,
    width: 24,
  },
  title: {
    fontSize: 16,
    textAlign: 'right',
    marginLeft: 4,
  },
  title_container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 2,
  },
  icon: {
    width: 18,
    height: 18,
    marginHorizontal: 2,
  },
  category_icon: {
    width: 32,
    height: 32,
    marginLeft: 4,
  },
  sub_title: {
    fontFamily: 'readex pro',
    fontSize: 14,
    marginHorizontal: 2,
  },
  text_container: {
    alignItems: 'flex-end',
    flex: 1,
  },
});
export {List};
