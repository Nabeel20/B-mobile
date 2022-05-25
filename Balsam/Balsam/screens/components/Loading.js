import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {ThemeContext, Colors} from '../Theme';
import LoadingIcon from '../../assets/loading.icon.png';
import ErrorIcon from '../../assets/error.icon.png';

export default function Loading({status = true, onPress}) {
  const {Theme} = React.useContext(ThemeContext);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Theme.background,
        },
      ]}>
      <View style={{alignSelf: 'center'}}>
        {status ? (
          <View>
            <Image
              source={{uri: LoadingIcon}}
              style={{
                width: 104,
                height: 104,
                alignSelf: 'center',
              }}
            />
            <Text
              style={[
                styles.title,
                {
                  color: Theme.text,
                },
              ]}>
              {' '}
              جار التحميل{' '}
            </Text>
            <ActivityIndicator
              size="small"
              color={Theme.text}
              style={{alignSelf: 'center'}}
            />
          </View>
        ) : (
          <View>
            <Image
              source={{uri: ErrorIcon}}
              style={{
                width: 80,
                height: 80,
                alignSelf: 'center',
              }}
            />
            <Text
              style={[
                styles.title,
                {
                  color: Colors.red,
                },
              ]}>
              فشل تحميل البيانات
            </Text>

            <TouchableOpacity onPress={onPress} style={styles.button}>
              <Text style={styles.text}> حاول مرة أخرى</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'readex pro',
    fontSize: 21,
    fontWeight: '600',
    margin: 16,
  },
  dots: {
    fontFamily: 'readex pro',
    fontSize: 21,
    fontWeight: '600',
    margin: 1,
  },
  text: {
    fontFamily: 'readex pro',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.blue,
  },
  button: {
    backgroundColor: Colors.blue_light,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginTop: 32,
  },
});
