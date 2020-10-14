import * as React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/HomeScreen';
import PagesName from './src/js/PagesName';
import DetailsScreen from './src/DetailsScreen';
import NewDailyPlan from './src/NewDailyPlan';
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name={PagesName.Home} component={HomeScreen} />
        <Stack.Screen name={PagesName.Details} component={DetailsScreen} />
        <Stack.Screen name={PagesName.NewDailyPlan} component={NewDailyPlan} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
