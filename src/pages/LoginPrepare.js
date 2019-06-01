import React, { Component } from "react";
import {
  View, StyleSheet, Text, TextInput, TouchableOpacity, TouchableHighlight,
  Image,
  Dimensions,
  Platform,
  Alert,
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
export default class LoginPrepare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: true,
      un: "",
      pa: "",
      kq: "CHUA LOGIN",
      token: "...",
      API: GLOBAL.serviceURL.urlIDServer,
      visibleModal: false
    }
  }
  async componentWillMount() {
    let that = this;
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
  async saveKey(value) {
    try {
      await AsyncStorage.setItem('tokenObject', value);
    } catch (error) {
      console.log("Error saving data" + error);
    }
  }
  ChangePage(page, params) {
    this.props.navigation.navigate(page, {
      params,
      onGoBack: () => this.refresh(),
    });
  }
  BackPage() {
    this.props.navigation.state.params.onGoBack(this.state.API);
    this.props.navigation.goBack();
  }
  refresh() {
    this.props.navigation.state;
    // this.props.callbackFromParent({ Attribute: "ChangeData" });
    this.setState({
      API: GLOBAL.serviceURL.urlIDServer
    });

  }
  ChangeAPI() {
    let APIObject = {
      urlIDServer: this.state.API,
      tm: this.state.API + 'api/tm/'
    }
    try {
      AsyncStorage.setItem('APIServe', JSON.stringify(APIObject));

    } catch (error) {
      console.log("Error saving data" + error);
    }
    this.BackPage();
  }
  LOGIN() {
    fetch("https://id.ooc.vn/identity/connect/token", {
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
        } else {
          console.log(responseJson);
          GLOBAL.Token = responseJson;
          this.setState({
            kq: "Thành Công"
          });
          this.saveKey(JSON.stringify(responseJson));
          this.props.navigation.navigate('FooterScreen', { tabPositions: 0 });
        }
      })

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
      <Text style={{ marginTop: 20, fontFamily: 'Muli', color: '#5d5d5d', fontSize: 13 }}>
        Vui lòng kiểm tra username hoặc password
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

        </View>
        <Text style={styles.dangnhap}>Nhập địa chỉ API</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
            numberOfLines={2}
            multiline={true}
            value={this.state.API}
            placeholder="Nhập địa chỉ API hệ thống"
            underlineColorAndroid='transparent'
            onChangeText={(API) => this.setState({ API })} />
        </View>
        <Text numberOfLines={2} multiline={true} style={{
          color: '#FFD500',
          fontWeight: 'bold',
          width: 274,
          marginBottom: 15,
          marginLeft: 30,
          textAlign: 'left', alignSelf: 'center'
        }}>Địa chỉ API không tồn tại. Vui lòng thử
        lại địa chỉ khác.</Text>

        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
          <Image
            style={{ marginTop: 19, marginRight: 7, width: 6, height: 10 }}
            source={require('../assets/icons/ArrowLeftBlack.png')}
          />
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Text style={{ fontSize: 15, color: '#FFFFFF', lineHeight: 46 }}>
              Quay lại
            </Text>
          </TouchableOpacity>

          <TouchableHighlight style={{
            height: 45,
            marginLeft: 84,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
            width: 107,
            borderRadius: 5,
            backgroundColor: "#f0822d"
          }} onPress={() => this.ChangeAPI()}>
            <Text style={styles.loginText}>Tiếp Tục</Text>
          </TouchableHighlight>
        </View>
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
    marginLeft: -150,
    textAlign: 'left', alignSelf: 'center'
  },
  logoContainer: {
    marginTop: 0,
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
    height: 64,
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
