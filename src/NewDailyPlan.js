import {Button, Text, View} from 'react-native';
import * as React from 'react';

const DetailsScreen = ({route, navigation}) => {
  const {otherParam} = route.params;
  otherParam.text += '!';
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen {otherParam.text}</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Done"
        onPress={() => {
          // Pass params back to home screen
          navigation.navigate('Home', {post: 'hey'});
        }}
      />
    </View>
  );
};

export default DetailsScreen;
