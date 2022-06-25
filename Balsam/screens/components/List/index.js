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
import {ThemeContext, Colors} from '../../Theme';

function EmptyList({theme}) {
  return (
    <View style={styles.loader}>
      <Text style={[styles.list_empty_title, {color: theme.text}]}>
        جار التحميل
      </Text>
      <ActivityIndicator size="small" color={theme.text} />
    </View>
  );
}
const icons = {
  stars: require('./icons/stars.png'),
  recommend: require('./icons/recommend.png'),
  'الإسعاف والطورائ': require('./icons/accident_and_emergency.png'),
  القلبية: require('./icons/cardiology.png'),
  'العناية المشددة': require('./icons/critical_care.png'),
  'أنف أذن حنجرة': require('./icons/ears_nose_and_throat.png'),
  الغدية: require('./icons/endocrinology.png'),
  الهضمية: require('./icons/gastroenterology.png'),
  'طب الشيخوخة': require('./icons/geriatrics.png'),
  النسائية: require('./icons/gynecology.png'),
  الدموية: require('./icons/hematology.png'),
  الجراحة: require('./icons/intensive_care_unit.png'),
  البولية: require('./icons/nephrology.png'),
  التوليد: require('./icons/obstetricsmonia.png'),
  الأورام: require('./icons/oncology.png'),
  العينية: require('./icons/opthalmology.png'),
  الأوسكي: require('./icons/outpatient_department.png'),
  الأطفال: require('./icons/pediatrics.png'),
  'علم الأدوية': require('./icons/pharmacy.png'),
  'الطب النفسي': require('./icons/psychology.png'),
  'علم الأشعة': require('./icons/radiology.png'),
  الصدرية: require('./icons/respirology.png'),
  الرثوية: require('./icons/rheumatology.png'),
  التشريح: require('./icons/body.png'),
};
function Icon({type, color}) {
  if (icons[type] === undefined) {
    return null;
  }
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
  onHome = false,
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
      {onHome ? (
        <Image
          source={icons[title]}
          style={[styles.categoryIcon, {tintColor: theme.text}]}
        />
      ) : null}
      <View style={styles.list_texts}>
        <View style={styles.title_container}>
          {done ? (
            <Image
              source={require('../../../assets/done.png')}
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
                <Icon icon="recommend" color={Colors.green} />
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

function List({data, onPress, onHome = false, animation, finishedIDs = []}) {
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
            has_updates,
            details,
            category,
            rtl,
            mcq,
            branch,
            url,
            number,
            id,
            editor_choice,
          },
        }) => (
          <Card
            onPress={() => {
              onPress({title, subject: category, rtl, mcq, url, branch});
            }}
            title={title}
            details={details}
            has_updates={has_updates}
            number={number}
            theme={Theme}
            onHome={onHome}
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
    textAlign: 'right',
  },
  list_empty_title: {
    fontFamily: 'ReadexPro-Regular',
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 8,
    fontSize: 18,
  },
  subTitle: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14,
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
    flex: 1,
  },
  icons_container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 4,
    paddingTop: 8,
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
  categoryIcon: {
    height: 32,
    width: 32,
    marginLeft: 4,
  },
  loader: {
    marginTop: 16,
  },
});

export {List};
