import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Alert,
} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {formatDate} from '../js/lib';
import {Root, Spinner, Toast, Textarea, Content, Form} from 'native-base';
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
  const [chooseDate, setChooseDate] = useState(today);
  const [plan, setPlan] = useState(initPlan());

  const switchFinished = (index) => (finished) => {
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

  const delAlert = (index) => async () => {
    const del = await new Promise((resolve) => {
      Alert.alert(
        'Detele Row',
        `Delete the ${index}th row?`,
        [
          {
            text: 'Cancel',
            onPress: () => resolve(false),
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => resolve(true)},
        ],
        {cancelable: false},
      );
    });
    if (del) {
      plan.plan_and_do.splice(index, 1);
      setPlan({...plan});
    }
  };

  const renderItem = ({item, index}) => (
    <DailyRow
      item={item}
      onSwitch={switchFinished(index)}
      time={`${item.start_time} - ${item.end_time}`}
      text={item.plan}
      enable={item.finished === 'finished'}
      onPress={delAlert(index)}
    />
  );

  const wrapLoading = async (fn) => {
    setLoading(true);
    const ret = await fn();
    setLoading(false);
    return ret;
  };

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
            <View style={{...styles.buttonView, justifyContent: 'flex-start'}}>
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
              <Button
                title="new plan"
                onPress={() =>
                  navigation.push(PagesName.NewDailyPlan, {
                    callback: (item) => {
                      plan.plan_and_do.push(item);
                      plan.plan_and_do.sort((item1, item2) => {
                        // 草 格式化工具把括号吃了
                        return item1.start_time === item2.start_time
                          ? item1.end_time < item2.end_time
                            ? -1
                            : 1
                          : item1.start_time < item2.start_time
                          ? -1
                          : 1;
                      });
                      setPlan({...plan});
                    },
                  })
                }
              />
            </View>
          </View>
          <Separator />
          <FlatList data={plan.plan_and_do} renderItem={renderItem} />
          <Content padder>
            <Form>
              <Textarea
                rowSpan={5}
                bordered
                placeholder="Check"
                style={{borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => setCheckText(text)}
                value={plan.check}
              />
            </Form>
            <Form>
              <Textarea
                rowSpan={5}
                bordered
                placeholder="Action"
                style={{borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => setActionText(text)}
                value={plan.action}
              />
            </Form>
          </Content>
          <TextInput />
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
