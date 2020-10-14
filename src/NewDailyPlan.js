import {Button, Text, View} from 'react-native';
import * as React from 'react';
import {useState} from 'react';
import {TimePickButton} from './components/TimePickButton';

const initDailyPlanRow = () => {
  return {start_time: '', end_time: '', plan: '', finished: '', reason: ''};
};

const NewDailyPlan = ({route, navigation}) => {
  const [planRow, setPlanRow] = useState(initDailyPlanRow());
  const {callback} = route.params;
  const hey = (v) => {
    alert(v);
  };

  const [hourMin, setHourMin] = useState(13 * 60 + 25);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>NewDailyPlan</Text>
      <TimePickButton time={hourMin} setDate={hey} />
      <Button
        title="Start Time"
        onPress={() => {
          callback && callback('what');
          // Pass params back to home screen
          navigation.pop();
        }}
      />
    </View>
  );
};

export default NewDailyPlan;
