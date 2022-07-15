import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Linking,
  Share,
  Modal,
  Image,
} from 'react-native';
import BackButton from './components/Back.button';
import {ThemeContext, Colors} from './Theme';

export default function Settings({navigation}) {
  const [message, updateMessage] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [options, setOptions] = React.useState(false);
  const [toast, setToast] = React.useState(false);
  const status = React.useRef(false);
  const input_ref = React.useRef(null);
  const send_count = React.useRef(0);

  const {Theme, Button, Text, View, darkTheme, setTheme} =
    React.useContext(ThemeContext);

  function change_theme() {
    //setTheme(!darkTheme)
    setOptions(!options);
  }

  function open_chat() {
    Linking.openURL('http://t.me/Balsam_dev');
  }
  function send_message() {
    setToast(true);
    updateMessage('');
    send_count.current += 1;
    input_ref.current.clear();
    status.current = true;
    if (send_count.current >= 5) {
      setToast(true);
      status.current = false;
    }
  }
  function handle_input(text) {
    if (toast) {
      status.current = false;
      setToast(false);
    }
    updateMessage(text);
  }
  function change_year() {
    setOptions(options => !options);
  }
  const OPTIONS = [
    {
      title: 'من نحن',
      function() {
        return null;
      },
      source: require('../assets/heart.png'),
    },
    {
      title: 'تواصل معنا',
      function() {
        return setModalVisible(true);
      },
      source: require('../assets/hand.png'),
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
          alert(error.message);
        }
      },
      source: require('../assets/hand_shake.png'),
    },
  ];

  return (
    <View style={styles.container} background>
      {/* <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setToast(false);
          status.current = false;
        }}
      >
        <KeyboardAvoidingView
          style={[styles.modalView, {
            backgroundColor: Theme.background,
          }]}
          behavior="height">
          <BackButton onPress={() => setModalVisible(!modalVisible)} _style={{ alignSelf: 'flex-end' }} />
          <View>
            <Text style={[styles.title, {
              color: Theme.text,
            }]}>الإعدادات{"\n"}
              <Text style={[styles.helperText, {
                color: Theme.grey.accent_2,
              }]}>يسعدنا أن نسمع منك :)</Text>
            </Text>

            <View style={{ marginHorizontal: 8 }}>
              <Title
                title='رسالة مجهولة الهوية'
                subTitle='نحترم خصوصية النقد ونشجع الأفكار الجديدة دون أن يكون العامل الشخصي عقبة بالطريق:'
                theme={Theme} />




              <TextInput
                multiline
                ref={input_ref}
                placeholder="أفكارك ومقترحاتك..."
                numberOfLines={3}
                maxLength={1500}
                placeholderTextColor={Theme.grey.accent_2}
                style={[styles.input, {
                  backgroundColor: Theme.grey.default,
                  borderColor: Theme.grey.accent_1,
                  color: Theme.grey.accent_2,
                }]}
                onChangeText={(text) => handle_input(text)}
              />
              <TouchableOpacity
                disabled={message.length < 5}
                style={[
                  styles.button,
                  {
                    opacity: message.length < 5 ? "50%" : "100%",
                    backgroundColor: Theme.grey.default,
                  }
                ]}
                onPress={send_message}
              >
                <Text style={[styles.text, { color: Theme.text }]}>إرسال</Text>
              </TouchableOpacity>

              {toast ? (
                <Text
                  style={[
                    styles.helperText,
                    {
                      color: status.current ? Colors.green : Colors.red,
                      alignSelf: "center"
                    }
                  ]}
                >
                  {status.current
                    ? "شكراً لك، تم إرسال الرسالة"
                    : "فشلت عملية الإرسال :("}
                </Text>
              ) : null}
            </View>


            <View style={{ height: 32 }} />
            <Title
              title='راسلنا على التلغرم'
              subTitle='دردش معنا! نرد على جميع الرسائل'
              theme={Theme} />

            <TouchableOpacity style={[styles.button, {
              backgroundColor: Theme.grey.default,
            }]} onPress={open_chat}>
              <Text style={[styles.text, { color: Theme.text }]}>التواصل شخصيا على التلغرام</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

      </Modal> */}

      <BackButton onPress={() => navigation.goBack()} />
      <Text style={styles.title} weight="medium">
        الإعدادات
      </Text>
      <Button onPress={change_theme} style={styles.button}>
        <Text weight="medium" size={16}>
          واجهة المستخدم
        </Text>
        <Text weight="bold" size={16} secondary>
          {darkTheme ? 'عاتمة' : 'مشرقة'}
        </Text>
      </Button>
      <Button onPress={change_theme} style={styles.button}>
        <Text weight="medium" size={16}>
          السنة الدراسية
        </Text>
        <Text size={16} secondary>
          الرابعة
        </Text>
      </Button>

      <ScrollView contentContainerStyle={{marginTop: 16}}>
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
    fontSize: 20,
    alignSelf: 'flex-end',
    marginTop: '20%',
    marginRight: 16,
    marginBottom: 16,
  },
  button: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    padding: 20,
    marginBottom: 14,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
