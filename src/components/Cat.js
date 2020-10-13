import React, {Component} from 'react';
import {Text} from 'react-native';

export default class Cat extends Component {
  state = {name: 'Maru'};
  constructor(props) {
    super(props);
  }

  appendStr() {
    this.setState({name: this.state.name + 's'});
  }

  render() {
    return (
      <Text
        onPress={() => {
          this.appendStr();
        }}>
        Hello, I am {this.state.name}!
      </Text>
    );
  }
}
