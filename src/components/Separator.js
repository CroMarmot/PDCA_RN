import {StyleSheet, View} from 'react-native';
import * as React from 'react';

export const Separator = () => <View style={styles.separator} />;
const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
