import React, { Component } from "react";
import { AppRegistry, View, TextInput, Text, Button, CheckBox, Alert, StyleSheet } from "react-native";
import Con from './Con1.js'
import ConText from './ConText.js'
import ConText1 from './ConText1.js'
export default class Cha extends Component {
    constructor() {
        super();
        this.state = {
            check: true,
            checkChild: {
                Child1: false,
                Child2: true
            },
            TextParent: "default",
            TextParent2: "default2"
        }
    }
    onPressLearnMore() {
        // Alert.alert('You tapped the button!')
        this.setState({
            check: !this.state.check
        });
        alert("kết quả" + !this.state.check)
    }
    myCallback = (dataFromChild) => {
        alert("kết quả" + dataFromChild)
    }
    getResponse(result) {
        this.setState({ TextParent: result });
    }
    getResponse2(result) {
        this.setState({ TextParent2: result });
        alert("Child 2 reload data: " + result)
    }
    render() {
        return (
            <View>
                <CheckBox
                    value={this.state.check} onChange={() => this.onPressLearnMore()}
                />
                <Con check={this.state.checkChild.Child1} callbackFromParent={this.myCallback} />
                <Con check={this.state.checkChild.Child2} callbackFromParent={this.myCallback} />
                <ConText TextPass={this.state.TextParent} callback={this.getResponse.bind(this)} />
                <ConText TextPass={this.state.TextParent} callback={this.getResponse.bind(this)} />
                <ConText1 TextPass={this.state.TextParent2} callback={this.getResponse2.bind(this)} />
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(val) => this.setState({ TextParent: val })}
                    placeholder="Text"
                    value={this.state.TextParent}
                />

            </View>
        );
    }
}


var ao = StyleSheet.create({
    bao: { width: 200, height: 100, backgroundColor: "yellow", margin: 20 }
});