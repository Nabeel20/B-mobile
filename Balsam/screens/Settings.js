import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Linking,
  Share,
  Modal,
  Image,
  ToastAndroid,
} from 'react-native';
import BackButton from './components/BackButton';
import {ThemeContext} from './Theme';

export default function Settings({navigation}) {
  const [modal_visible, set_modal_visible] = React.useState(false);
  const [happy_message_sent, set_happy_message_sent] = React.useState(false);
  const [sad_message_sent, set_sad_message_sent] = React.useState(false);
  const {Button, Text, View, darkTheme, setTheme} =
    React.useContext(ThemeContext);

  function change_theme() {
    setTheme(!darkTheme);
  }

  const OPTIONS = [
    {
      title: 'من نحن',
      function() {
        return null;
      },
      source: require('../assets/heart-icon.png'),
    },
    {
      title: 'تواصل معنا',
      function() {
        return set_modal_visible(true);
      },
      source: require('../assets/hand-icon.png'),
    },
    {
      title: 'أخبر صديقاً',
      async function() {
        try {
          await Share.share({
            message:
              'تطبيق بلسم | بلسم لكل مشاكل الأسئلة الطبية حمله عن طريق قناتنا على التلغرام: ',
          });
        } catch (error) {
          ToastAndroid.showWithGravity(
            'للاسف لم تشارك أحداً',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }
      },
      source: require('../assets/hand-shake-icon.png'),
    },
  ];
  function send_happy_message() {
    if (happy_message_sent) {
      return;
    }
    set_happy_message_sent(true);
  }
  function send_sad_message() {
    if (sad_message_sent) {
      return;
    }
    set_sad_message_sent(true);
  }
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={modal_visible}
        onRequestClose={() => {
          set_modal_visible(!modal_visible);
        }}>
        <View style={styles.container} background>
          <BackButton onPress={() => set_modal_visible(!modal_visible)} />
          <View style={styles.header_spacer} />
          <Text style={styles.title} weight="bold">
            تواصل معنا
          </Text>
          <ScrollView>
            <Text style={styles.header}>يعجبك شيء ما</Text>
            <Button
              onPress={send_happy_message}
              style={happy_message_sent ? null : styles.button}>
              <Text weight="medium" style={styles.button_text}>
                {happy_message_sent ? 'شكراً من القلب' : 'اضغط لإرسال ابتسامة'}
              </Text>
              {happy_message_sent ? null : (
                <Image
                  style={styles.icon}
                  source={require('../assets/happy-icon.png')}
                />
              )}
            </Button>

            <Text style={styles.header}>لا يعجبني شيء ما</Text>
            <Button
              onPress={send_sad_message}
              style={sad_message_sent ? null : styles.button}>
              <Text weight="medium" style={styles.button_text}>
                {sad_message_sent
                  ? 'نتمنى أن تخبرنا السبب'
                  : 'اضغط لإرسال عتاب'}
              </Text>
              {sad_message_sent ? null : (
                <Image
                  style={styles.icon}
                  source={require('../assets/mad-icon.png')}
                />
              )}
            </Button>

            <Text style={[styles.header, styles.spacer]}>أرسل مقترح</Text>
            <Button
              onPress={() =>
                Linking.openURL('https://forms.gle/xf6tJbr2Qg7ytFqaA')
              }
              style={styles.button}>
              <Text weight="medium" style={styles.button_text}>
                رابط مجهول الهوية
              </Text>
              <Image
                style={styles.icon}
                source={require('../assets/angle-icon.png')}
              />
            </Button>

            <Button
              onPress={() => Linking.openURL('http://t.me/Balsam_dev')}
              style={styles.button}>
              <Text weight="medium" style={styles.button_text}>
                دردش معنا على التلغرام
              </Text>
              <Image
                style={styles.icon}
                source={require('../assets/super-happy-icon.png')}
              />
            </Button>

            <Text style={[styles.header, styles.spacer]}>
              بلسم على وسائل التواصل
            </Text>
            <Button
              onPress={() => Linking.openURL('https://t.me/Balsam_app')}
              style={styles.button}>
              <Text weight="medium" style={styles.button_text}>
                تلغرام
              </Text>
            </Button>
            <Button onPress={send_happy_message} style={styles.button}>
              <Text weight="medium" style={styles.button_text}>
                انستغرام
              </Text>
            </Button>
          </ScrollView>
        </View>
      </Modal>

      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.header_spacer} />
      <Text style={styles.title} weight="medium">
        الإعدادات
      </Text>
      <Button onPress={change_theme} style={styles.button}>
        <Text weight="medium" size={16}>
          واجهة المستخدم
        </Text>
        <Text weight="medium" size={16} color="grey-dark">
          {darkTheme ? 'عاتمة' : 'مشرقة'}
        </Text>
      </Button>
      <Button onPress={change_theme} style={styles.button}>
        <Text weight="medium" size={16}>
          السنة الدراسية
        </Text>
        <Text size={16} color="grey-dark">
          الرابعة
        </Text>
      </Button>

      <ScrollView contentContainerStyle={styles.scroll_view}>
        {OPTIONS.map((item, index) => {
          return (
            <Button onPress={item.function} key={index} style={styles.button}>
              <Text size={16}> {item.title}</Text>
              <Image style={styles.icon} source={item.source} />
            </Button>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 16,
  },
  button: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    padding: 18,
    marginBottom: 10,
  },
  icon: {
    width: 32,
    height: 32,
  },
  header: {
    fontSize: 17,
    margin: 4,
    marginBottom: 8,
  },
  spacer: {
    marginTop: 32,
  },
  button_text: {
    fontSize: 16,
  },
  header_spacer: {
    height: '20%',
  },
  scroll_view: {
    marginTop: 16,
  },
});
