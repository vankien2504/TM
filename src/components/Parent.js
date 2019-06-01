import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Child from './Child.js';

export default class Parent extends Component {
    constructor() {
        super();
        this.state = {
            result: 0
        };
    }

    getResponse(result) {
        this.setState({ result });
    }
    render() {
        return (
            <View>
                <Text>{this.state.result}</Text>
                <Child num={2} callback={this.getResponse.bind(this)} />
            </View>
        );
    }
}