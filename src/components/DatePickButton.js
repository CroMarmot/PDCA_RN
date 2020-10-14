import * as React from 'react';
import {useState} from 'react';
import {Button, View} from 'react-native';
import {formatDate} from '../js/lib';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export const DatePickButton = ({date, setDate}) => {
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
