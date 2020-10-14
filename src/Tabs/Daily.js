import {
  StyleSheet,
  Button,
  ScrollView,
  View,
  FlatList,
  Text,
  TextInput,
  Switch,
} from 'react-native';
import * as React from 'react';
import {useState, useEffect} from 'react';
import {formatDate} from '../lib';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Spinner, Toast, Root} from 'native-base';

const DatePickButton = ({date, setDate}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (d) => {
    hideDatePicker();
    setDate(d);
  };

  return (
    <View>
      <Button title={formatDate(date)} onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={date}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const Separator = () => <View style={styles.separator} />;

const Item = ({item, onSwitch}) => {
  return (
    <View style={styles.item}>
      <View style={styles.title}>
        <Text style={styles.title}>
          {item.start_time} - {item.end_time}
        </Text>
      </View>
      <View style={styles.contentView}>
        <Text style={styles.content}>{item.plan}</Text>
      </View>
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={'#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onSwitch}
        value={item.finished === 'finished'}
      />
    </View>
  );
};

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

const Daily = () => {
  const [today, setToday] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [dataStr, setDataStr] = useState('');
  const [chooseDate, setChooseDate] = useState(today);
  const [plan, setPlan] = useState(initPlan());

  const host = 'http://192.168.80.121:8088';

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
    <Item item={item} onSwitch={argsFunc(index)} />
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
              body: JSON.stringify({date:formatDate(chooseDate)}),
            })
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
              <Button title="new plan" />
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
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
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
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default Daily;
