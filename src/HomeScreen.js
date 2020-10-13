import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Daily from './Tabs/Daily';
import Messages from './Tabs/Messages';

const Tab = createBottomTabNavigator();

const HomeScreen = ({route, navigation}) => {
  const passedParam = {otherParam: {text: 'anything you want here'}};
  if (route.params) {
    alert(route.params.post);
  }
  return (
    <Tab.Navigator>
      <Tab.Screen name="Daily" component={Daily} />
      <Tab.Screen name="Messages" component={Messages} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
