import React, { Component } from "react";
import { AppRegistry, TextInput, View, Text, Button, Alert, CheckBox, StyleSheet } from "react-native";
export default class ConText1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TextPass: this.props.TextPass
        }
    }

    calc(data) {
        this.setState({ TextPass: data })
        this.props.callback(data);
    }
    componentWillUpdate(nextProps, nextState) {
        nextState.TextPass = nextProps.TextPass;
    }
    render() {
        213
        return (
            <View>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(val) => this.calc(val)}
                    placeholder="Text"
                    value={this.state.TextPass}
                />
            </View>
        );
    }
}


var ao = StyleSheet.create({
    bao: { marginLeft: 20 }
});