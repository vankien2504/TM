import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Login from './src/pages/Login.js'
import LoginPrepare from './src/pages/LoginPrepare'
import { StackNavigator } from 'react-navigation';
import Settings from './src/components/Settings.js';
import Home from './src/components/Home.js';
import Cha from './src/components/Cha.js';
import Parent from './src/components/Parent.js';
import FooterPlus from './src/components/footer/footer-plus.js';
import Footer from './src/pages/footer.js';
import Header from './src/pages/task/header.js';
import TaskEdit from './src/pages/task/task-edit.js';
import TaskChild from './src/pages/task/task-child';
import TaskFilter from './src/pages/task/task-filter.js';
import TaskSort from './src/pages/task/task-sort.js';
import Employee from './src/pages/task/employee.js';
import EmployeeRelationship from './src/pages/task/employee-relationship';
import Tag from './src/pages/task/tag.js';
import Document from './src/pages/task/document';
import DocumentAdd from './src/pages/task/document-add';
import DocumentDetail from './src/pages/task/document-detail';
import DocumentInputDetail from './src/pages/task/document-input-detail';
import Calendar from './src/pages/calendar/calendar';
import Config from './src/pages/config/config';
import Notify from './src/pages/config/notify';
import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
  setCustomImage,
  setCustomTouchableOpacity
} from 'react-native-global-props';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
// Setting a default background color for all View components.
const customViewProps = {
  style: {
    // backgroundColor: '#d3d3d3' // light gray
  }
};

// Getting rid of that ugly line on Android and adding some custom style to all TextInput components.
const customTextInputProps = {
  underlineColorAndroid: 'rgba(0,0,0,0)',
  style: {
    borderWidth: 1,
    borderColor: 'gray',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white'
  }
};

// Setting default styles for all Text components.
const customTextProps = {
  style: {
    fontSize: 13,
    fontFamily: 'Muli',
    fontFamily: Platform.OS === 'ios' ? 'Muli' : 'Muli',
    color: '#5d5d5d'
  }
};

// Makes every image resize mode cover by default.
const customImageProps = {
  // resizeMode: 'cover'
};

// Adds a bigger hit box for all TouchableOpacity's.
const customTouchableOpacityProps = {
  // hitSlop: { top: 15, right: 15, left: 15, bottom: 15 }
};
setCustomView(customViewProps);
setCustomTextInput(customTextInputProps);
setCustomText(customTextProps);
setCustomImage(customImageProps);
setCustomTouchableOpacity(customTouchableOpacityProps);


const AppNavigator = StackNavigator({
  DocumentAddScreen: { screen: DocumentAdd },
  CalendarScreen: { screen: Calendar },
  HeaderScreen: { screen: Header },
  TaskEditScreen: { screen: TaskEdit },
  EmployeeScreen: { screen: Employee },
  EmployeeRelationshipScreen: { screen: EmployeeRelationship },
  TagScreen: { screen: Tag },
  DocumentScreen: { screen: Document },
  DocumentDetailScreen: { screen: DocumentDetail },
  DocumentInputDetailScreen: { screen: DocumentInputDetail },
  TaskSortScreen: { screen: TaskSort },
  TaskFilterScreen: { screen: TaskFilter },
  TaskChildScreen: { screen: TaskChild },
  FooterPlusScreen: { screen: FooterPlus },
  FooterScreen: { screen: Footer },
  ChaScreen: { screen: Cha },
  ParentScreen: { screen: Parent },
  LoginScreen: { screen: Login },
  LoginPrepareScreen: { screen: LoginPrepare },
  HomeScreen: { screen: Home },
  ChaScreen: { screen: Cha },
  ConfigScreen: { screen: Config },
  NotifyScreen: { screen: Notify },
  SettingScreen: { screen: Settings }
},
  {
    headerMode: 'none',
    initialRouteName: "LoginScreen",

  });
export default class App extends Component {
  render() {
    return (
      <AppNavigator />
    );
  }
}
