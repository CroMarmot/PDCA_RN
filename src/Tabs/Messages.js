import {Button, Text, View} from 'react-native';
import PagesName from '../PagesName';
import * as React from 'react';

const Messages = ({route, navigation}) => {
  const passedParam = {otherParam: {text: 'anything you want here'}};
  if (route.params) {
    alert(route.params.post);
  }
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen {passedParam.otherParam.text} </Text>
      <Button
        title="Navigate to Details"
        onPress={() => navigation.navigate(PagesName.Details, passedParam)}
      />
      <Button
        title="Push to Details"
        onPress={() => navigation.push(PagesName.Details, passedParam)}
      />
    </View>
  );
}

export default Messages;
