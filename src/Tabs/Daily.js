import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {formatDate} from '../js/lib';
import {Root, Spinner, Toast} from 'native-base';
import {DailyRow} from '../components/DailyRow';
import {Separator} from '../components/Separator';
import {DatePickButton} from '../components/DatePickButton';
import {host} from '../js/config';
import PagesName from '../js/PagesName';

const initPlan = () => {
  return {
    _id: {
      $oid: '',
    },
    date: '',
    plan_and_do: [], // start_time,end_time,plan,finished,reason
    check: '',
    action: '',
  };
};

const Daily = ({route, navigation}) => {
  const [today, setToday] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [dataStr, setDataStr] = useState('');
  const [chooseDate, setChooseDate] = useState(today);
  const [plan, setPlan] = useState(initPlan());

  const argsFunc = (index) => (finished) => {
    plan.plan_and_do[index].finished = finished ? 'finished' : '';
    setPlan({...plan});
  };

  const setCheckText = (text) => {
    plan.check = text;
    setPlan({...plan});
  };
  const setActionText = (text) => {
    plan.action = text;
    setPlan({...plan});
  };

  const renderItem = ({item, index}) => (
    <DailyRow
      item={item}
      onSwitch={argsFunc(index)}
      time={`${item.start_time} - ${item.end_time}`}
      text={item.plan}
      enable={item.finished === 'finished'}
    />
  );

  const changeDate = (date) => {
    setChooseDate(date);
  };

  const wrapLoading = async (fn) => {
    setLoading(true);
    const ret = await fn();
    setLoading(false);
    return ret;
  };

  useEffect(() => {
    setDataStr(JSON.stringify(plan));
  }, [plan]);

  const syncFromServer = () => {
    console.log('syncing...');
    wrapLoading(() =>
      fetch(`${host}/api/get_daily_pdca`, {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({date: formatDate(chooseDate)}),
      }),
    )
      .then((response) => {
        console.log(response.status);
        if (response.status === 404) {
          // TODO 为空处理给服务器
          return initPlan();
        } else if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((myJson) => {
        console.log('setPlan... with myJson');
        // plan = myJson;
        setPlan(myJson);
      });
  };

  const uploadToServer = () => {
    // TODO check valid
    plan.date = formatDate(chooseDate);
    console.log('hey');
    wrapLoading(() =>
      fetch(`${host}/api/add_daily_pdca`, {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify(plan),
      }),
    )
      .then((response) => {
        console.log('upload', response.status);
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((myJson) => {
        plan._id = myJson.insertedId;
        Toast.show({
          text: '保存成功',
          duration: 1000,
        });
      })
      .catch((err) => {
        Toast.show({
          text: err,
          duration: 1000,
        });
      });
  };

  useEffect(syncFromServer, [chooseDate]);

  const passParams = {
    callback:(v)=>{
      alert(v);
    }
  };

  return (
    <Root>
      <View
        style={{
          backgroundColor: 'lightblue',
          position: 'relative',
          height: '100%',
        }}>
        <ScrollView style={{zIndex: 0}}>
          <View style={styles.fixToText}>
            <View style={styles.buttonView}>
              <Button
                title="previous"
                onPress={() => {
                  setChooseDate(
                    new Date(chooseDate.getTime() - 24 * 60 * 60 * 1000),
                  );
                }}
              />
            </View>
            <View style={{...styles.buttonView, justifyContent: 'center'}}>
              <DatePickButton date={chooseDate} setDate={setChooseDate} />
            </View>
            <View style={{...styles.buttonView, justifyContent: 'flex-end'}}>
              <Button
                title="next"
                onPress={() => {
                  setChooseDate(
                    new Date(chooseDate.getTime() + 24 * 60 * 60 * 1000),
                  );
                }}
              />
            </View>
          </View>
          <View style={styles.fixToText}>
            <View style={{...styles.buttonView, justifyContent: 'flex-start'}}>
              <Button title="upload" onPress={uploadToServer} />
            </View>
            <View style={{...styles.buttonView, justifyContent: 'center'}}>
              <Button title="sync" onPress={syncFromServer} />
            </View>
            <View style={{...styles.buttonView, justifyContent: 'flex-end'}}>
              <Button title="new plan" onPress={() => navigation.push(PagesName.NewDailyPlan, passParams)} />
            </View>
          </View>
          <Separator />
          <FlatList data={plan.plan_and_do} renderItem={renderItem} />
          <TextInput
            placeholder="Check"
            multiline={true}
            style={{borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => setCheckText(text)}
            value={plan.check}
          />
          <TextInput
            placeholder="Action"
            multiline={true}
            style={{borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => setActionText(text)}
            value={plan.action}
          />
          <View>
            <Text>{dataStr}</Text>
          </View>
        </ScrollView>
        {loading && (
          <View style={styles.spinnerView}>
            <Spinner />
          </View>
        )}
      </View>
    </Root>
  );
};

const styles = StyleSheet.create({
  fixToText: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  buttonView: {
    flex: 1,
    flexDirection: 'row',
  },
  spinnerView: {
    zIndex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明
  },
});

export default Daily;
