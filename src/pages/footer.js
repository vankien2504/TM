import React, { Component } from "react";
import { View, ActivityIndicator, StyleSheet, Image, Text, AsyncStorage } from "react-native";
import TabNavigator from 'react-native-tab-navigator';
import Header from './task/header.js';
import Calendar from './calendar/calendar';
import Config from './config/config';
import DashboardHeader from './dashboard/dashboard-header';
import UserService from "../share/services/user.service";
const GLOBAL = require('../share/global.js');
import TaskService from "../share/services/task.service";
export default class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: "HomeScreen",
            // selectedTab: "dashboard",
            selectedTab: "task",
            // selectedTab: "calendar",
            // selectedTab: "config",
            isLoading: true,
        }
        console.log('footer loaded');

    }
    ChangePage() {
        this.props.navigation.navigate('TaskEditScreen');
    }
    componentDidMount() {
        // this.setState({ selectedTab: "task" });
    }
    componentWillMount() {
        // this.setState({ selectedTab: "calendar" });
        AsyncStorage.getItem('userInfo').then((res, error) => {
            if (res) {

            } else {
                this.loadUser();
            }

        });
        // this.setState({ isLoading: true });
        AsyncStorage.getItem('lstTrangThai').then((res, error) => {
            if (res) {
                let responseJson = JSON.parse(res);
                GLOBAL.lstTrangThai = responseJson;
                // this.setState({ isLoading: false });

            } else {

                this.LayDanhSachTrangThai();
            }

        });
        AsyncStorage.getItem('lstDoUuTien').then((res, error) => {

            if (res) {
                let responseJson = JSON.parse(res);
                GLOBAL.lstDoUuTien = responseJson;
                this.setState({ isLoading: false });

            } else {
                // this.setState({ isLoading: true });
                this.LayDanhSachDoUuTien();
            }

        });

        this.LayDanhSachPhanLoai();
        this.LayDanhSachNhan();
    }
    LayDanhSachTrangThai() {
        let param = {
            "request": [
                { "Page": 1, "PageSize": 50, "Filter": "", Sort: "Sort-asc" },
            ]
        }

        TaskService.LayDanhSachTrangThai(param).then((res) => {
            let responseJson = JSON.parse(res)
            GLOBAL.lstTrangThai = responseJson.Data;
            try {
                AsyncStorage.setItem('lstTrangThai', JSON.stringify(responseJson.Data));
            } catch (error) {
                console.log("Error saving data" + error);
            }
            this.setState({ isLoading: false });
        });
    }
    LayDanhSachDoUuTien() {
        let param = {
            "request": [
                { "Page": 1, "PageSize": 50, "Filter": "", Sort: "Sort-asc" },
            ]
        }
        TaskService.LayDanhSachDoUuTien(param).then((res) => {
            let responseJson = JSON.parse(res)
            GLOBAL.lstDoUuTien = responseJson.Data;
            try {
                AsyncStorage.setItem('lstDoUuTien', JSON.stringify(responseJson.Data));
            } catch (error) {
                console.log("Error saving data" + error);
            }
            this.setState({ isLoading: false });
        });
    }
    LayDanhSachPhanLoai() {
        let param = {
            "request": [
                { "Page": 1, "PageSize": 50, "Filter": "", Sort: "Sort-asc" },
            ]
        }
        TaskService.LayDanhSachPhanLoai(param).then((res) => {
            let responseJson = JSON.parse(res)
            GLOBAL.lstPhanLoai = responseJson.Data;
        });
    }
    LayDanhSachNhan() {
        let param = {
            "request": [
                { "Page": 1, "PageSize": 50, "Filter": "", Sort: "Sort-asc" },
            ]
        }
        TaskService.LayDanhSachNhan(param).then((res) => {
            let responseJson = JSON.parse(res)
            GLOBAL.lstNhan = responseJson.Data;
        });
    }
    loadUser() {
        UserService.GetData().then((res) => {
            let responseJson = JSON.parse(res)
            GLOBAL.userInfo = responseJson;
            try {
                AsyncStorage.setItem('userInfo', res);
            } catch (error) {
                console.log("Error saving data" + error);
            }
        });
    }
    Logout() {

        let keys = ['tokenObject', 'userInfo', 'taskConfig', 'task', 'lstTrangThai', 'lstDoUuTien'];
        AsyncStorage.multiRemove(keys, (err) => {
            this.props.navigation.navigate('LoginScreen', { tabPositions: 0 });
        });

        // AsyncStorage.removeItem('tokenObject').then((res, error) => {

        // });
    }
    render() {
        if (this.state.isLoading) {
            return (<View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(255,255,255, 0.6)' }}>
                <ActivityIndicator size="large" color="#F1802E" />
                <Text style={{ color: '#F1802E', textAlign: "center" }}>
                    Đang khởi tạo dữ liệu cá nhân
            </Text>

            </View>);
        }
        let tabBarHeight = 55;
        return (

            <View style={{ flex: 1 }}>
                <TabNavigator tabBarStyle={{ height: tabBarHeight, overflow: 'hidden' }}
                    sceneStyle={{ paddingBottom: tabBarHeight }}>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'dashboard'}
                        title="Dashboard"
                        titleStyle={{ fontSize: 13, color: '#5d5d5d' }}
                        selectedTitleStyle={{ color: "#F1802E" }}
                        renderIcon={() => <Image style={{ width: 21, height: 21 }} source={require('../assets/icons/Dashboard.png')} />}
                        renderSelectedIcon={() => <Image style={{ width: 21, height: 21 }} source={require('../assets/icons/DashboardActive.png')} />}
                        onPress={() => { this.setState({ selectedTab: 'dashboard' }) }}>
                        <DashboardHeader navigation={this.props.navigation} />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'task'}
                        title="Công việc"
                        titleStyle={{ fontSize: 13, color: '#5d5d5d' }}
                        selectedTitleStyle={{ color: "#F1802E" }}
                        renderIcon={() => <Image style={{ width: 19, height: 21 }} source={require('../assets/icons/Task.png')} />}
                        renderSelectedIcon={() => <Image style={{ width: 19, height: 21 }} source={require('../assets/icons/TaskActive.png')} />}
                        onPress={() => this.setState({ selectedTab: 'task' })}>
                        <Header navigation={this.props.navigation} />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'calendar'}
                        title="Lịch biểu"
                        titleStyle={{ fontSize: 13, color: '#5d5d5d' }}
                        selectedTitleStyle={{ color: "#F1802E" }}
                        renderIcon={() => <Image style={{ width: 19, height: 21 }} source={require('../assets/icons/Calendar.png')} />}
                        renderSelectedIcon={() => <Image style={{ width: 19, height: 21 }} source={require('../assets/icons/CalendarActive.png')} />}
                        onPress={() => this.setState({ selectedTab: 'calendar' })}>

                        <Calendar />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'report'}
                        title="Báo cáo"
                        titleStyle={{ fontSize: 13, color: '#5d5d5d' }}
                        selectedTitleStyle={{ color: "#F1802E" }}
                        renderIcon={() => <Image style={{ width: 21, height: 23 }} source={require('../assets/icons/Report.png')} />}
                        renderSelectedIcon={() => <Image style={{ width: 21, height: 23 }} source={require('../assets/icons/ReportActive.png')} />}
                        onPress={() => this.setState({ selectedTab: 'report' })}>

                        <View style={{ flex: 1, backgroundColor: "yellow" }}>

                        </View>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'config'}
                        title="Cấu hình"
                        titleStyle={{ fontSize: 13, color: '#5d5d5d' }}
                        selectedTitleStyle={{ color: "#F1802E" }}
                        renderIcon={() => <Image style={{ width: 21, height: 21 }} source={require('../assets/icons/Setting.png')} />}
                        renderSelectedIcon={() => <Image style={{ width: 21, height: 21 }} source={require('../assets/icons/SettingActive.png')} />}
                        onPress={() => this.setState({ selectedTab: 'config' })}

                    >
                        <Config navigation={this.props.navigation} />
                    </TabNavigator.Item>
                </TabNavigator>

            </View>
        );
    }
}
