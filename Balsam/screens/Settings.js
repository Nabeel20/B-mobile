import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Share,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import BackButton from './components/Back.button';
import {ThemeContext, Colors} from './Theme';

function ThemeToggle({onPress, theme, isDark}) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.grey.default,
        },
      ]}
      onPress={onPress}>
      <Text style={[styles.text, {color: theme.text}]}>
        واجهة المستخدم {'\n'}
        <View style={{height: 20}} />
        <Text style={[styles.helperText, {color: theme.grey.accent_2}]}>
          اضغط للتبديل لواجهة{' '}
          {isDark ? 'مشرقة كالصباح الجميل' : 'معتمة لـليلة أكثر تركيزاً'}
        </Text>
      </Text>
      <Text style={[styles.text, {color: theme.text}]}>
        {isDark ? 'معتمة' : 'مشرقة'}
      </Text>
    </TouchableOpacity>
  );
}

function Title({title, subTitle, theme}) {
  return (
    <Text style={[styles.text, {color: theme.text}]}>
      {title}
      {'\n'}
      <Text style={[styles.helperText, {color: theme.grey.accent_2}]}>
        {subTitle}
      </Text>
    </Text>
  );
}

function Card({onPress, theme, title, subTitle}) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.grey.default,
        },
      ]}
      onPress={onPress}>
      <Title title={title} subTitle={subTitle} theme={theme} />
    </TouchableOpacity>
  );
}

export default function Settings({navigation}) {
  const [message, updateMessage] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [toast, setToast] = React.useState(false);
  const status = React.useRef(false);
  const input_ref = React.useRef(null);
  const send_count = React.useRef(0);

  const {Theme, darkTheme, setTheme} = React.useContext(ThemeContext);

  function change_theme() {
    setTheme(!darkTheme);
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

  const OPTIONS = [
    {
      title: 'من نحن',
      sub_title:
        'بلسم لجميع المشكلات المتلعقة بعملية الاختبار الذاتية الطبية، بمراعاة جميع الجزئيات التي تعيق العملية',
      function() {
        return null;
      },
    },
    {
      title: 'تواصل معنا',
      sub_title: 'فكرة؟ مقترح؟ صادفت مشكلة؟ تواصل معنا من فضلك',
      function() {
        return setModalVisible(true);
      },
    },
    {
      title: 'أخبر صديقاً',
      sub_title: 'ساعد صديقـــك/ـتك للاستفادة من تطبيق بلسم :)',
      async function() {
        try {
          await Share.share({
            message:
              'تطبيق بلسم | بلسم لكل مشاكل الأسئلة الطبية حمله عن طريق قناتنا على التلغرام: ',
          });
        } catch (error) {
          //
        }
      },
    },
    {
      title: 'قناة التلغرام',
      sub_title: 'اشترك بقناتنا على التلغرام لآخر التحديثات والأخبار',
      function() {
        return Linking.openURL('https://t.me/Balsam_app');
      },
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Theme.background,
        },
      ]}>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setToast(false);
          status.current = false;
        }}>
        <KeyboardAvoidingView
          style={[
            styles.modalView,
            {
              backgroundColor: Theme.background,
            },
          ]}
          behavior="height">
          <BackButton
            onPress={() => navigation.goBack()}
            _style={{alignSelf: 'flex-end'}}
          />
          <View>
            <Text
              style={[
                styles.title,
                {
                  color: Theme.text,
                },
              ]}>
              الإعدادات{'\n'}
              <Text
                style={[
                  styles.helperText,
                  {
                    color: Theme.grey.accent_2,
                  },
                ]}>
                يسعدنا أن نسمع منك :)
              </Text>
            </Text>

            <View style={{marginHorizontal: 8}}>
              <Title
                title="رسالة مجهولة الهوية"
                subTitle="نحترم خصوصية النقد ونشجع الأفكار الجديدة دون أن يكون العامل الشخصي عقبة بالطريق:"
                theme={Theme}
              />

              <TextInput
                multiline
                ref={input_ref}
                placeholder="أفكارك ومقترحاتك..."
                numberOfLines={3}
                maxLength={1500}
                placeholderTextColor={Theme.grey.accent_2}
                style={[
                  styles.input,
                  {
                    backgroundColor: Theme.grey.default,
                    borderColor: Theme.grey.accent_1,
                    color: Theme.grey.accent_2,
                  },
                ]}
                onChangeText={text => handle_input(text)}
              />
              <TouchableOpacity
                disabled={message.length < 5}
                style={[
                  styles.button,
                  {
                    opacity: message.length < 5 ? '50%' : '100%',
                    backgroundColor: Theme.grey.default,
                  },
                ]}
                onPress={send_message}>
                <Text style={[styles.text, {color: Theme.text}]}>إرسال</Text>
              </TouchableOpacity>

              {toast ? (
                <Text
                  style={[
                    styles.helperText,
                    {
                      color: status.current ? Colors.green : Colors.red,
                      alignSelf: 'center',
                    },
                  ]}>
                  {status.current
                    ? 'شكراً لك، تم إرسال الرسالة'
                    : 'فشلت عملية الإرسال :('}
                </Text>
              ) : null}
            </View>

            <View style={{height: 32}} />
            <Title
              title="راسلنا على التلغرم"
              subTitle="دردش معنا! نرد على جميع الرسائل"
              theme={Theme}
            />

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: Theme.grey.default,
                },
              ]}
              onPress={open_chat}>
              <Text style={[styles.text, {color: Theme.text}]}>
                التواصل شخصيا على التلغرام
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <BackButton
        onPress={() => navigation.goBack()}
        _style={{alignSelf: 'flex-end'}}
      />
      <View style={{height: '35%'}} />
      <Text
        style={[
          styles.title,
          {
            color: Theme.text,
          },
        ]}>
        الإعدادات
      </Text>
      <ThemeToggle onPress={change_theme} theme={Theme} isDark={darkTheme} />

      <View style={{height: 32}} />

      <ScrollView>
        {OPTIONS.map((item, index) => {
          return (
            <Card
              title={item.title}
              subTitle={item.sub_title}
              onPress={item.function}
              theme={Theme}
              key={index}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  title: {
    fontFamily: 'ReadexPro-Bold',
    fontSize: 20,
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 16,
  },
  text: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 16,
    padding: 8,
  },
  helperText: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 12,
  },
  card: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  input: {
    borderRadius: 10,
    margin: 8,
    borderWidth: 1,
    fontFamily: 'ReadexPro-Medium',
    padding: 8,
    fontSize: 14,
    textAlign: 'right',
  },
  modalView: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 10,
    margin: 8,
    alignItems: 'center',
    padding: 8,
  },
});
