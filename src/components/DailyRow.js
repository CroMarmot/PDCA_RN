import {StyleSheet, Switch, Text, View} from 'react-native';
import * as React from 'react';

export const DailyRow = ({item, time, text, enable, onSwitch}) => {
  return (
    <View style={styles.item}>
      <View style={styles.title}>
        <Text>{time}</Text>
      </View>
      <View style={styles.contentView}>
        <Text style={styles.content}>{text}</Text>
      </View>
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={'#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onSwitch}
        value={enable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: '#EEE',
    borderRadius: 10,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  contentView: {
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', // not working
  },
});
