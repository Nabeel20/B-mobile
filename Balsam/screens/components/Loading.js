import React from 'react';
import {StyleSheet, Image, ActivityIndicator} from 'react-native';
import {ThemeContext} from '../Theme';
import {useNetInfo} from '@react-native-community/netinfo';

export default function Loading({
  status = true,
  onPress,
  text = 'حاول مرة أخرى',
}) {
  const netInfo = useNetInfo() ?? {isConnected: true};
  const {Theme, View, Button, Text} = React.useContext(ThemeContext);
  if (netInfo.isConnected === false) {
    status = false;
  }
  let message = status ? 'جار التحميل...' : 'للأسف حدث خطأ بتحميل البيانات';

  return (
    <View style={styles.container} background>
      <View style={styles.centred_box}>
        <Image
          source={
            status
              ? require('../../assets/happy-icon.png')
              : require('../../assets/error-icon.png')
          }
          style={styles.image}
        />
        <Text style={styles.title} weight="medium">
          {netInfo.isConnected === false ? 'لست متصلاً بالانترنت' : message}
        </Text>

        {status === false ? (
          <Button round onPress={onPress}>
            <Text weight="medium">{text}</Text>
          </Button>
        ) : (
          <ActivityIndicator size="small" color={Theme.text} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centred_box: {
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    margin: 16,
    textAlign: 'center',
  },
  image: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
});
