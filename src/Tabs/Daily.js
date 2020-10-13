import {StyleSheet, Button, View, FlatList, Text, Switch} from 'react-native';
import * as React from 'react';
import {useState, useEffect} from 'react';
import {formatDate} from '../lib';

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

const fetchApi = (host, date) =>
  fetch(`${host}/api/get_daily_pdca`, {
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
    body: JSON.stringify({date}),
  });

const Daily = () => {
  const currentDay = new Date();
  const [dataStr, setDataStr] = useState('');
  const [plan, setPlan] = useState({
    _id: {
      $oid: '',
    },
    date: '',
    plan_and_do: [], // start_time,end_time,plan,finished,reason
    check: '',
    action: '',
  });
  const host = 'http://192.168.80.121:8088';

  const argsFunc = (index) => (finished) => {
    plan.plan_and_do[index].finished = finished ? 'finished' : '';
    setPlan({...plan});
  };

  const renderItem = ({item, index}) => (
    <Item item={item} onSwitch={argsFunc(index)} />
  );

  useEffect(() => {
    setDataStr(JSON.stringify(plan));
  }, [plan]);

  const syncFromServer = () => {
    console.log('syncing...');
    fetchApi(host, formatDate(currentDay))
      .then((response) => {
        console.log(response.status);
        if (response.status !== 200) {
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

  useEffect(syncFromServer, []);

  return (
    <View>
      <View style={styles.fixToText}>
        <Button title="previous day" />
        <Button title={formatDate(currentDay)} />
        <Button title="next day" />
      </View>
      <Separator />
      <View style={styles.fixToText}>
        <Button title="upload to server" />
        <Button title="sync from server" onPress={syncFromServer} />
        <Button title="new plan" />
      </View>
      <Separator />
      <View>
        <Text>{dataStr}</Text>
      </View>
      <FlatList data={plan.plan_and_do} renderItem={renderItem} />
    </View>
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
    backgroundColor: 'lightgrey',
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
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default Daily;
