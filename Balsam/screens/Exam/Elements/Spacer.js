import React from 'react';
import {View} from 'react-native';

export default function Spacer({vertical = 8}) {
  return <View style={{height: vertical}} />;
}
