import React, { Component } from "react";
import { AppRegistry, View, Text, Button, Alert, StyleSheet } from "react-native";

export default class ConNguoi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chieucao: 0
        }
    }
    onPressLearnMore() {
        // Alert.alert('You tapped the button!')
        this.setState({
            chieucao: this.state.chieucao + 100
        });
    }
    thaydoiten() {
        // Alert.alert('You tapped the button!')
        this.props.hoten = "Bang";
    }
    render() {
        return (
            <View>
                <Text style={ao.bao}>
                    {this.props.hoten} Cao {this.state.chieucao} cm
            </Text>
                <Button
                    onPress={() => { this.onPressLearnMore() }}
                    title="Learn More"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button" />
                <Button
                    onPress={() => { this.thaydoiten() }}
                    title="Learn More"
                    color="#841584"
                    accessibilityLabel="thay doi ten" />
            </View>


        );
    }
}


var ao = StyleSheet.create({
    bao: { width: 200, height: 100, backgroundColor: "yellow", margin: 20 }
});