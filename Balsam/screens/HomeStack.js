/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ToastAndroid,
    PermissionsAndroid,
    NativeModules,
} from 'react-native';
import {
    Button,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import * as Network from 'expo-network';

import { createStackNavigator } from '@react-navigation/stack';
import { Dirs, FileSystem } from 'react-native-file-access';
import { DateTime } from 'luxon';

import CryptoJS from 'crypto-js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './Home';
import Exam from './Exam';
import FinishScreen from './FinishScreen';
import Activation from './Activation';

import {
    update_database,
    get_database,
    update_bookmarks,
    update_act,
    update_cache_array,
} from './db';
const { Storage } = NativeModules;

export default function HomeStack({ navigation }) {
    const Stack = createStackNavigator();

    const [loading, setLoading] = React.useState(true);
    const [shouldAskForPermissions, setShouldAskForPermissions] = React.useState(
        false,
    );

    async function ask_for_permission() {
        try {
            const has_premissons = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            ]);
            if (
                has_premissons['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'
            ) {
                setShouldAskForPermissions(false);
            } else {
                setShouldAskForPermissions(true);
            }
        } catch (error) {
            ToastAndroid.showWithGravity(
                'Error#001',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
            );
        }
    }

    React.useEffect(() => {
        function decode_file(file) {
            let bytes = CryptoJS.AES.decrypt(file, 'nabeeladnanalinizam_20900!@#()');
            return bytes.toString(CryptoJS.enc.Utf8);
        }
        function set_last_time(file) {
            if (file.last_time == null) {
                file.last_time = DateTime.now().toISODate();
            }
        }
        function add_methods(file) {
            file.update_answered_wrong = function update_answered_wrong(new_data) {
                this.answered_wrong.push(new_data);
            };
            file.get_answered_wrong = function get_answered_wrong() {
                return this.answered_wrong;
            };
            file.update_average_time = function update_average_time(new_time) {
                this.average_time.push(new_time);
            };
            file.get_average_time = function get_average_time() {
                if (this.average_time.length >= 1) {
                    let math = Math.ceil(
                        this.average_time.reduce((a, b) => a + b) /
                        this.average_time.length,
                    );
                    let time = (math / 60).toFixed(2).toString().split('');
                    if (time.length === 4) {
                        time.unshift('0');
                        time[2] = ':';
                        return time.join('');
                    }
                    time[2] = ':';
                    return time.join('');
                }
                return 0;
            };
            file.update_average_accuracy = function update_average_accuracy(
                new_score,
            ) {
                this.average_accuracy.push(new_score);
            };
            file.get_average_accuracy = function get_average_accuracy() {
                if (this.average_accuracy.length >= 1) {
                    return Math.ceil(
                        this.average_accuracy.reduce((a, b) => a + b) /
                        this.average_accuracy.length,
                    );
                }
                return 0;
            };
            file.is_paid = function is_paid() {
                return this.paid ? true : false;
            };
            file.get_question = function get_question(index) {
                return this.questions[index];
            };
            file.get_estimated_time = function get_estimated_time() {
                if (this.questions.length > 1) {
                    let time = (
                        (this.questions.length * this.estimated_time_for_question) /
                        60
                    )
                        .toFixed(2)
                        .toString()
                        .split('');
                    if (time.length === 4) {
                        time.unshift('0');
                        time[2] = ':';
                        return time.join('');
                    }
                    time[2] = ':';
                    return time.join('');
                }
                return '00:45';
            };
            file.get_remaining_time = function get_remaining_time(index) {
                let diff = this.questions.length - index;
                if (diff === 1) {
                    diff = 0.6;
                }
                let time = ((diff * this.estimated_time_for_question) / 60)
                    .toFixed(2)
                    .toString()
                    .split('');
                if (time.length === 4) {
                    time.unshift('0');
                    time[2] = ':';
                    return time.join('');
                }
                time[2] = ':';

                return time.join('');
            };
            file.set_estimated_time_per_question = function set_estimated_time_per_question(
                time,
            ) {
                this.estimated_time_for_question = time;
            };
            file.get_questions_number = function get_questions_number() {
                return this.questions.length;
            };
            file.is_cycle = function is_cycle() {
                return this.cycle_university.length > 3 ? true : false;
            };
            file.get_shuffled_questions = function get_shuffled_questions(
                onlyQuestions = true,
                onlyChoices = true,
            ) {
                if (onlyQuestions) {
                    let array = this.questions;
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                    this.questions = array;
                }

                if (onlyChoices) {
                    for (let index = 0; index < this.questions.length; index++) {
                        let choices_array = this.questions[index].choices;
                        for (let i = choices_array.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [choices_array[i], choices_array[j]] = [
                                choices_array[j],
                                choices_array[i],
                            ];
                        }
                        this.questions[index].choices = choices_array;
                    }
                }
            };

            for (let i = 0; i < file.questions.length; i++) {
                const question = file.questions[i];
                question.set_explanation = function set_explanation(data) {
                    this.explanation = data;
                };
                question.set_answered_wrong = function set_answered_wrong(number) {
                    this.answered_wrong += number;
                };
                question.is_right = function is_right(d) {
                    return d === this.right_answer ? true : false;
                };
                question.has_explanation = function has_explanation() {
                    return this.explanation.length > 3 ? true : false;
                };
            }
        }
        async function get_data() {
            try {
                let paths = await Storage.get_files_paths();
                for (let i = 0; i < paths.length; i++) {
                    try {
                        let file = await FileSystem.readFile(paths[i]);
                        let decoded_file = decode_file(file);

                        if (decoded_file.length > 10) {
                            let file_output = JSON.parse(decoded_file);
                            file_output.path = paths[i];
                            set_last_time(file_output);
                            add_methods(file_output);
                            update_database(file_output);
                        }
                    } catch (error) {
                        ToastAndroid.showWithGravity(
                            'Error#003',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                        );
                    }
                }
            } catch (error) {
                ToastAndroid.showWithGravity(
                    'Error#002',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                );
            }
        }
        async function check_permission() {
            try {
                let has_permission = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                );
                if (has_permission) {
                    if (get_database().length === 0) {
                        get_data();
                    }
                    setLoading(false);
                } else {
                    setShouldAskForPermissions(true);
                }
            } catch (error) {
                ToastAndroid.showWithGravity(
                    'Error#004',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                );
            }
        }
        async function read_blsm() {
            try {
                let is_file = await FileSystem.exists(Dirs.DocumentDir + '/b.blsm');
                if (is_file) {
                    try {
                        let file = await FileSystem.readFile(Dirs.DocumentDir + '/b.blsm');
                        let decoded_file = decode_file(file);
                        let json_file = JSON.parse(decoded_file);
                        update_bookmarks(json_file.bookmarks);
                        update_act(json_file.act_array);
                        update_cache_array(json_file.cache_array);
                    } catch (error) {
                        ToastAndroid.showWithGravity(
                            'Error#005',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                        );
                    }
                } else {
                    try {
                        let mac = null;
                        try {
                            mac = await Network.getMacAddressAsync();
                        } catch (error) {
                            ToastAndroid.showWithGravity(
                                'Error#006',
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                            );
                        }
                        let data = {
                            mac,
                            act_array: [],
                            cache_array: [],
                            bookmarks: [],
                        };
                        let path = Dirs.DocumentDir + '/b.blsm';
                        let encrypted = CryptoJS.AES.encrypt(
                            JSON.stringify(data),
                            'nabeeladnanalinizam_20900!@#()',
                        ).toString();
                        await FileSystem.writeFile(path, encrypted);
                    } catch (error) {
                        ToastAndroid.showWithGravity(
                            'Error#007',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                        );
                    }
                }
            } catch (error) {
                ToastAndroid.showWithGravity(
                    'Error#008',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                );
            }
        }

        check_permission();
        read_blsm();
    }, [shouldAskForPermissions]);

    function loading_component() {
        if (shouldAskForPermissions === false) {
            return (
                <Animatable.View
                    animation="flash"
                    iterationCount="infinite"
                    duration={3500}
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                    }}>
                    <MaterialCommunityIcons name="folder-sync" size={35} color="grey" />
                    <Text style={[styles.headline, { color: 'grey' }]}>جاري التحميل</Text>
                </Animatable.View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <Animatable.Text animation="fadeInRight" style={styles.welcome}>
                        مرحباً يا بلسم!
          </Animatable.Text>
                    <Animatable.Text
                        animation="fadeInRight"
                        delay={450}
                        style={styles.headline}>
                        تطبيق حل أسئلة صمم خصيصاً ليكون بلسماً لمشاكلك.
          </Animatable.Text>
                    <Animatable.View
                        animation="fadeIn"
                        delay={700}
                        style={{ paddingTop: 10 }}>
                        <MaterialCommunityIcons
                            name="lightbulb"
                            size={20}
                            color="grey"
                            style={{ alignSelf: 'flex-start' }}
                        />
                        <Text style={styles.text}>
                            {' '}
              ملفات اختبارات بلسم بلاحقة
              <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontFamily: 'Cairo_700Bold',
                                    marginHorizontal: 14,
                                }}>
                                quiz.
              </Text>
                            {'\n'}
              يمكنك تحميل الملفات من قناتنا على التلغرام
              <MaterialCommunityIcons
                                style={{ paddingHorizontal: 4 }}
                                name="telegram"
                                size={16}
                                color="grey"
                            />{' '}
                            <Text style={{ paddingLeft: 5 }}>@Balsam_app</Text> {'\n'}
              تتم قراءة الملفات تلقائياً من مجلد التنزيلات
              <MaterialCommunityIcons
                                style={{ paddingHorizontal: 5 }}
                                name="folder-download"
                                size={16}
                                color="grey"
                            />{' '}
                            {'\n'}
                        </Text>
                    </Animatable.View>
                    <Animatable.View animation="fadeInUp" delay={1000}>
                        <Button
                            style={{ padding: 5 }}
                            labelStyle={styles.button}
                            color="#313131"
                            onPress={() => ask_for_permission()}>
                            الحصول على صلاحية الوصول للذاكرة
            </Button>
                    </Animatable.View>
                </View>
            );
        }
    }
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerStyle: { height: 50 } }}>
            {loading ? (
                <Stack.Screen
                    options={{ headerShown: false, gestureEnabled: false }}
                    name="Loading"
                    component={loading_component}
                />
            ) : (
                    <>
                        <Stack.Screen
                            name="Home"
                            component={Home}
                            options={{
                                title: 'بلســم',
                                headerTitleStyle: { fontFamily: 'Cairo-Bold', fontSize: 16 },
                                headerLeft: () => (
                                    <MaterialCommunityIcons
                                        size={30}
                                        style={{ marginLeft: 20 }}
                                        name="menu"
                                        onPress={() => navigation.openDrawer()}
                                    />
                                ),
                            }}
                        />
                        <Stack.Screen
                            name="Exam"
                            options={({ route }) => ({
                                headerTitleStyle: {
                                    color: '#313131',
                                    fontSize: 14,
                                    fontFamily: 'Cairo-Bold',
                                },
                            })}
                            component={Exam}
                        />
                        <Stack.Screen
                            name="FinishScreen"
                            component={FinishScreen}
                            options={({ route }) => ({
                                title: route.params.quiz.title,
                                headerTitleStyle: {
                                    color: '#313131',
                                    fontSize: 14,
                                    fontFamily: 'Cairo-Bold',
                                },
                            })}
                        />
                        <Stack.Screen
                            name="Activation"
                            component={Activation}
                            options={({ route }) => ({
                                headerTitleStyle: {
                                    color: '#313131',
                                    fontSize: 14,
                                    fontFamily: 'Cairo-Bold',
                                },
                            })}
                        />
                    </>
                )}
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        flex: 1,
        width: '100%',
    },
    title: {
        fontFamily: 'Cairo-Bold',
        fontSize: 18,
        paddingBottom: 3,
    },
    subtitle: {
        fontFamily: 'Cairo-SemiBold',
        fontSize: 14,
        height: 20,
        lineHeight: 20,
        color: '#616161',
        marginHorizontal: 3,
    },
    numbers: {
        fontFamily: 'Cairo-SemiBold',
        fontSize: 15,
        color: '#616161',
        height: 20,
        lineHeight: 23,
    },
    cycle_university: {
        fontFamily: 'Cairo-SemiBold',
        fontSize: 12,
        height: 20,
        marginLeft: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    dialog_text: {
        fontFamily: 'Cairo-SemiBold',
        fontSize: 15,
        lineHeight: 20,
        marginLeft: 5,
        color: '#313131',
        selectable: false,
    },
    dialog_title: {
        fontFamily: 'Cairo-Bold',
        fontSize: 18,
    },
    dialog_button: {
        letterSpacing: 0,
        fontFamily: 'Cairo-Bold',
    },
    headline: {
        fontFamily: 'Cairo-Bold',
        fontSize: 21,
        paddingBottom: 20,
    },
});