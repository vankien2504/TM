import React, { Component } from 'react';
import { Button } from 'react-native';

export default class Child extends Component {
    calc() {
        this.props.callback(this.props.num * 2);
    }

    render() {
        return (<Button onPress={() => this.calc()} title="Calc" />)
    }
}