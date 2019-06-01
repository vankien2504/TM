// Settings.js
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import ConNguoi from './ConNguoi.js'
const GLOBAL = require('../share/global.js');
export class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ten: "kien",
      globalInfo: GLOBAL.userNews.preferred_username
    }
    console.log(GLOBAL.userNews.preferred_username);
  }
  setUsername() {
    GLOBAL.userNews.preferred_username = "Reser Name";
    this.setState({
      globalInfo: GLOBAL.userNews.preferred_username
    })
  }
  render() {
    return (
      <View>
        <Text>{this.state.globalInfo}</Text>
        <Button onPress={() => this.setUsername()} title="setUsername" />
        <ConNguoi hoten={this.state.ten} />
        <ConNguoi hoten="Teo" />
        <ConNguoi hoten="Ti" />
        <ConNguoi hoten="Tun" />


        <Button onPress={() => this.props.navigation.navigate('HomeScreen')} title="Home" />
      </View>
    )
  }
};

export default Settings;