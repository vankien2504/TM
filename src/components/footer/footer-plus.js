import React, { Component } from "react";
import { AppRegistry, View, TextInput, Text, Button, CheckBox, Alert, StyleSheet } from "react-native";
import Icon from '../../elements/Icon';
import TabBar from 'react-native-nav-tabbar';
import Image from 'react-native-remote-svg'
export default class FooterPlus extends Component {
    constructor() {
        super();
        this.state = {

        }
    }
    render() {
        return (
            <View style={styles.container}>

                <TabBar>
                    <TabBar.Item
                        icon={require('./images/Home.png')}
                        selectedIcon={require('./images/HomeActive.png')}
                        title="Home"
                    >
                        <View style={styles.textContent}>
                            <Text style={{ fontSize: 18 }}>Home</Text>
                        </View>
                    </TabBar.Item>
                    <TabBar.Item>
                        <View style={styles.textContent}>
                            <Text style={{ fontSize: 18 }}>Friend</Text>
                        </View>
                    </TabBar.Item>
                    <TabBar.Item
                        icon={require('./images/My.png')}
                        selectedIcon={require('./images/MyActive.png')}
                        title="Me"
                    >
                        <View style={styles.textContent}>
                            <Text style={{ fontSize: 18 }}>Me</Text>
                        </View>
                    </TabBar.Item>
                </TabBar>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: 'center',
        backgroundColor: "#efeff4",
    },
    textContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});