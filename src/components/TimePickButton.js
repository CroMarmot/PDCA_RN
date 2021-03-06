import * as React from 'react';
import {useState} from 'react';
import {Button, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatTime} from '../js/lib';

export const TimePickButton = ({time, setDate}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const currentTime = new Date(2000, 0, 0).getTime();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (d) => {
    hideDatePicker();
    setDate((d - currentTime) / 60 / 1000);
  };

  return (
    <View>
      <Button title={formatTime(time)} onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        date={currentTime + time * 60 * 1000}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};
