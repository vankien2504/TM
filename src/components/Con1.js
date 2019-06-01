import React, { Component } from "react";
import { AppRegistry, View, Text, Button, Alert, CheckBox, StyleSheet } from "react-native";
export default class Con extends Component {
    constructor(props) {
        super(props);
        this.state = {
            check: this.props.check
        }
    }
    onPressLearnMore() {
        // Alert.alert('You tapped the button!')
        this.setState({
            check: !this.state.check
        });
        this.props.callbackFromParent(!this.state.check);
    }
    render() {
        return (
            <View>
                <CheckBox style={ao.bao}
                    value={this.state.check} onChange={() => this.onPressLearnMore()}
                />
            </View>
        );
    }
}


var ao = StyleSheet.create({
    bao: { marginLeft: 20 }
});