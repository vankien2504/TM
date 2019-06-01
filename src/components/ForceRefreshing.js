import React, { Component } from "react";
import { AppRegistry, View, Text, Button, CheckBox, Alert, StyleSheet } from "react-native";
export default class ForceRefreshing extends Component {
    state = {
        user: {}
    }

    componentDidMount() {
        this.fetchUser().then(this.refreshUser)
    }

    setNewColor = color => {
        this.updateUser({ color }).then(this.refreshUser)
    }

    refreshUser = res => this.setState({ user: res.data.user })

    render() {
        const { user } = this.state;

        return (
            <ShoeList id={user.id} />
        )
    }
}
