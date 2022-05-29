import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import BackButton from './components/Back.button';
import SearchBar from './components/SearchBar';
import {ThemeContext} from './Theme';

function Search({navigation, route}) {
  const {Theme} = React.useContext(ThemeContext);
  const [keywords, setKeywords] = React.useState('');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Theme.background,
        },
      ]}>
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.spacer} />
      <Text
        style={[
          styles.title,
          {
            color: Theme.text,
          },
        ]}>
        البحث بالملفات
      </Text>
      <View style={styles.search_bar_container}>
        <SearchBar onText={text => setKeywords(text)} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
  },
  spacer: {
    height: '5%',
  },
  search_bar_container: {
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    fontFamily: 'ReadexPro-Bold',
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'flex-end',
    margin: 16,
  },
});

export default Search;
