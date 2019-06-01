import React, { Component } from "react";
import {
  View, StyleSheet, Text, TextInput, TouchableOpacity, TouchableHighlight,
  Image,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
  CheckBox,
  ImageBackground,
  AsyncStorage
} from "react-native";
import Checkbox from 'react-native-custom-checkbox';
const GLOBAL = require('../share/global.js');
const { width, height } = Dimensions.get('window')
const launchscreenBg = require("../assets/imgs/login-backgroud.png");
const launchscreenLogo = require("../assets/imgs/digitask.png");
import LibCommonService from '../share/services/lib-common.service.js';
import TaskService from '../share/services/common.service.js';
import UserService from '../share/services/user.service';
import Modal from "react-native-modal";
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: true,
      un: "",
      pa: "",
      kq: "CHUA LOGIN",
      token: "...",
      API: GLOBAL.serviceURL.urlIDServer,
      visibleModal: false,
      isLoading: false,
    }
  }
  async componentWillMount() {
    let that = this;
    AsyncStorage.getItem('APIServe').then((res, error) => {
      if (res) {
        let APIServe = JSON.parse(res);
        GLOBAL.serviceURL.urlIDServer = APIServe.urlIDServer;
        GLOBAL.serviceURL.tm = APIServe.tm;
        this.setState({ API: GLOBAL.serviceURL.urlIDServer });
      } else {

      }
    });
    AsyncStorage.getItem('tokenObject').then((res, error) => {
      if (res) {
        GLOBAL.Token = JSON.parse(res);
        AsyncStorage.getItem('userInfo').then((res, error) => {
          if (res) {
            let responseJson = JSON.parse(res)
            GLOBAL.userInfo = responseJson;

            this.props.navigation.navigate('FooterScreen', { tabPositions: 0 });
          } else {
            UserService.GetData().then((res) => {
              let responseJson = JSON.parse(res)
              GLOBAL.userInfo = responseJson;
              try {
                AsyncStorage.setItem('userInfo', res);
              } catch (error) {
                console.log("Error saving data" + error);
              }
              this.props.navigation.navigate('FooterScreen', { tabPositions: 0 });
            });
          }
        });

      }
      console.log(res);
    });
  }
  ChangePage(page, params) {
    this.props.navigation.navigate(page, {
      params,
      onGoBack: (api) => this.refresh(api),
    });
  }
  BackPage() {
    this.props.navigation.state.params.onGoBack(this.state.task);
    this.props.navigation.goBack();
  }
  refresh(api) {
    this.props.navigation.state;
    // this.props.callbackFromParent({ Attribute: "ChangeData" });
    AsyncStorage.getItem('APIServe').then((res, error) => {
      if (res) {
        let APIServe = JSON.parse(res);
        GLOBAL.serviceURL.urlIDServer = APIServe.urlIDServer;
        GLOBAL.serviceURL.tm = APIServe.tm;
        this.setState({ API: GLOBAL.serviceURL.urlIDServer });
      } else {

      }
    });
  }
  async saveKey(value) {
    try {
      await AsyncStorage.setItem('tokenObject', value);
    } catch (error) {
      console.log("Error saving data" + error);
    }
  }
  LOGIN() {
    this.setState({ isLoading: true });
    fetch(GLOBAL.serviceURL.urlIDServer + "identity/connect/token", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Authorization": 'Basic ' + 'bW9iaWxlOm1vYmlsZW1pc29jZA=='
      }),
      body: "" +
        "username" + "=" + this.state.un + "&" +
        "password" + "=" + this.state.pa + "&" +
        "grant_type" + "=" + "password" + "&" +
        "scope" + "=" + 'openid profile roles publicApi mail company all_claims'

    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error) {
          this.setState({ visibleModal: true });
          this.setState({ isLoading: false });
        } else {
          console.log(responseJson);
          GLOBAL.Token = responseJson;
          this.setState({
            kq: "Thành Công"
          });
          this.saveKey(JSON.stringify(responseJson));
          UserService.GetData().then((res) => {
            let responseJson = JSON.parse(res)
            GLOBAL.userInfo = responseJson;
            this.setState({ isLoading: false });
            try {
              AsyncStorage.setItem('userInfo', res);
            } catch (error) {
              console.log("Error saving data" + error);
            }
            this.props.navigation.navigate('FooterScreen', { tabPositions: 0 });
          }).catch(err => {
            this.setState({ isLoading: false });
          });
        }
      }).catch(err => {
        this.setState({ isLoading: false, visibleModal: true });
      });

  }
  toggleSwitch4() {
    this.setState({ showPassword: !this.state.showPassword });
  }
  renderModalContent = () => (
    <View style={styles.modalContent}>
      <View style={{ flexDirection: "row" }}>
        <Image
          style={{ marginLeft: 0, marginRight: 15, height: 24, width: 24 }}
          source={require('../assets/icons/danger.png')}
        />
        <Text style={{ fontFamily: 'Muli', fontWeight: 'bold', color: '#ff0000', fontSize: 15 }}>Đăng nhập không thành công</Text>
      </View>
      <Text style={{ marginTop: 20, fontFamily: 'Muli', color: '#5d5d5d', fontSize: 13, marginLeft: 30 }}>
        Vui lòng kiểm tra thông tin đăng nhập
        </Text>
      <TouchableOpacity onPress={() => this.setState({ visibleModal: false })}>
        <Image
          style={{ alignSelf: 'center', marginTop: 37, marginBottom: 22, marginRight: 20, height: 22, width: 74 }}
          source={require('../assets/icons/dong.png')}
        />
      </TouchableOpacity>

    </View>
  );
  render() {
    if (this.state.isLoading) {
      return (<View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(255,255,255, 0.6)' }}>
        <ActivityIndicator size="large" color="#F1802E" />
        <Text style={{ color: '#F1802E', textAlign: "center" }}>
          Đang xử lý đăng nhập
      </Text>

      </View>);
    }
    return (
      <ImageBackground source={launchscreenBg} style={styles.imageContainer}>

        <View style={styles.logoContainer}>
          <Modal
            isVisible={this.state.visibleModal}
            onBackdropPress={() => this.setState({ visibleModal: false })}
            animationIn="slideInLeft"
            animationOut="slideOutRight">
            {this.renderModalContent()}
          </Modal>
          <Image source={launchscreenLogo} style={styles.logo} resizeMode="contain" />
          <View style={{ flexDirection: 'row', marginTop: 18 }}>
            <Text style={{ fontSize: 15, color: '#FFFFFF70', width: 178 }}>
              {this.state.API}
            </Text>
            <TouchableOpacity onPress={() => this.ChangePage('LoginPrepareScreen')}>
              <Text style={{ fontSize: 15, color: '#FFFFFF', marginLeft: 12 }}>
                Thay đổi
            </Text>
            </TouchableOpacity>
            <Image
              style={{ marginTop: 6, marginLeft: 7, width: 6, height: 10 }}
              source={require('../assets/icons/ArrowRightBlack.png')}
            />
          </View>
        </View>
        <Text style={styles.dangnhap}>Đăng nhập</Text>
        <View style={styles.inputContainer}>
          <Image style={styles.inputIconUser} source={require("../assets/icons/User.png")} />
          <TextInput style={styles.inputs}
            placeholder="Tên đăng nhập"
            underlineColorAndroid='transparent'
            onChangeText={(un) => this.setState({ un })} />
        </View>

        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require("../assets/icons/lock.png")} />
          <TextInput style={styles.inputs}
            secureTextEntry={this.state.showPassword}
            placeholder="Mật khẩu"
            underlineColorAndroid='transparent'
            onChangeText={(pa) => this.setState({ pa })} />
        </View>
        <View style={{ flexDirection: 'column', marginLeft: -130, marginBottom: 40 }}>
          <View style={{ flexDirection: 'row' }}>
            <Checkbox
              checked={!this.state.showPassword}
              style={{ backgroundColor: 'transparent', borderColor: 'white', color: 'white', borderRadius: 3, marginTop: 0 }}
              onChange={() => this.toggleSwitch4()} />
            <Text style={{ color: 'white' }}> Hiển thị mật khẩu</Text>
          </View>
        </View>
        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.LOGIN()}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('restore_password')}>
          <Text style={{ color: 'white', fontSize: 15, }}>Quên mật khẩu?</Text>
        </TouchableHighlight>
        {/* <View style={{ flex: 1 }}>

        </View> */}
        <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('register')}>
          <Text style={{ color: '#ffffff', fontSize: 15, opacity: .5, position: 'absolute', bottom: 0 }}>Copyright 2018 OOC </Text>
        </TouchableHighlight>
      </ImageBackground>
    );
  }
}

var styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "#FFF",
    paddingLeft: 26,
    paddingRight: 26,
    paddingTop: 20,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  dangnhap: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: -190,
    textAlign: 'left', alignSelf: 'center'
  },
  logoContainer: {
    marginTop: 44,
    marginBottom: 45
  },
  logo: {
    left: Platform.OS === "android" ? 0 : 50,
    // top: Platform.OS === "android" ? 35 : 60,
    width: 265,
    height: 60
  },
  imageContainer: {
    width: null,
    height: null,
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center', alignItems: 'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 16,
    height: 18,
    marginLeft: 15,
    justifyContent: 'center'
  },
  inputIconUser: {
    width: 18,
    height: 18,
    marginLeft: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    width: 250,
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: "#f0822d"

  },
  loginText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
  }
});
