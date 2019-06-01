// Home.js

import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
const GLOBAL = require('../share/global.js');
export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: ""
    }
  }

  loadUser() {
    fetch("http://id.hrs.demo.3ps.vn:89/identity/connect/userinfo", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Data-type": "json",
        "Authorization": 'Bearer ' + GLOBAL.Token.access_token
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        GLOBAL.userNews = responseJson;
        console.log(JSON.stringify(GLOBAL.userNews));
        this.setState({
          userInfo: GLOBAL.userNews.preferred_username
        });
      })

  }

  render() {
    return (
      <View>
        <Text>This is the Home screen</Text>
        <Text>{this.state.userInfo}</Text>
        <Button onPress={() => this.loadUser()} title="LoadUser" />
        <Button onPress={() => this.props.navigation.navigate('SettingScreen')} title="Setting" />
      </View>
    )
  }
}

export default Home