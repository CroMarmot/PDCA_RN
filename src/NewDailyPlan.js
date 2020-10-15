import {Button, ScrollView, Text, TextInput, View} from 'react-native';
import * as React from 'react';
import {useState} from 'react';
import {TimePickButton} from './components/TimePickButton';
import {formatTime} from './js/lib';
import {Content, Form, Textarea} from 'native-base';

const initDailyPlanRow = () => {
  return {start_time: '', end_time: '', plan: '', finished: '', reason: ''};
};

const NewDailyPlan = ({route, navigation}) => {
  const [planRow, setPlanRow] = useState(initDailyPlanRow());
  // TODO any other way?
  const {callback} = route.params;

  const [startHourMin, setStartHourMin] = useState(0);
  const [endHourMin, setEndHourMin] = useState(0);

  const setPlan = (v) => {
    planRow.plan = v;
    setPlanRow({...planRow});
  };

  const createButton = () => {
    planRow.start_time = formatTime(startHourMin);
    planRow.end_time = formatTime(endHourMin);
    setPlanRow({...planRow});
    callback && callback(planRow);
    navigation.pop();
  };

  return (
    <View style={{flex: 1}}>
      <Content padder>
        <View style={{flexDirection: 'row'}}>
          <Text>Start Time</Text>
          <TimePickButton time={startHourMin} setDate={setStartHourMin} />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>End Time</Text>
          <TimePickButton time={endHourMin} setDate={setEndHourMin} />
        </View>
        <Form>
          <Textarea
            rowSpan={5}
            bordered
            placeholder="Plan Detail"
            style={{borderColor: 'gray', borderWidth: 1}}
            onChangeText={setPlan}
            value={planRow.plan}
          />
        </Form>
        <Button title="Create" onPress={createButton} />
      </Content>
    </View>
  );
};

export default NewDailyPlan;
