import React, { Component } from "react";
import { ScrollView, AsyncStorage, TouchableOpacity, FlatList, View, Dimensions, style, TextInput, Text, Button, Icon, CheckBox, Alert, StyleSheet, Image } from "react-native";
import TaskBoxFollow from "./task-box-follow.js"
import SearchBar from 'react-native-material-design-searchbar';
import Checkbox from 'react-native-custom-checkbox';
import CheckboxModest from 'react-native-modest-checkbox'
import TaskService from "../../share/services/task.service";
import Moment from 'moment';
const GLOBAL = require('../../share/global.js');
export default class TaskChild extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.navigation.state.params.params,
            TaskFollowingTab: 0,
            collapse: false,
            taskAll: [],
            taskFollowing: [],
            taskFollowingStand: [],

            taskAll1: [],
            taskFollowing1: [],
            taskFollowingStand1: [],

            tasklst: []
        }
    }
    componentWillMount() {

    }
    componentDidMount() {
        AsyncStorage.getItem('taskConfig').then((res, error) => {
            if (res) {
                let taskConfig = JSON.parse(res);
                this.setState({
                    TaskFollowingTab: taskConfig.TaskFollowingTab,
                })
            } else {
                let taskConfig = {
                    index: 1,
                    TaskFollowingTab: 0,
                    TaskApprovingTab: 0,
                }
                try {
                    AsyncStorage.setItem('taskConfig', JSON.stringify(taskConfig));
                } catch (error) {
                    console.log("Error saving data" + error);
                }
            }
        });
        this.LoadTask();

    }
    LoadTask() {
        AsyncStorage.getItem('task').then((res, error) => {
            if (res) {
                let taskObject = JSON.parse(res)
                let taskArr = [];

                taskObject.forEach(element => {
                    element.ListTask.Data.forEach(element1 => {
                        taskArr.push(element1);
                        if (element1.IDParent == this.state.task.ID && element1.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
                            this.state.taskFollowing.push(element1);
                        }
                        if (element1.IDParent == this.state.task.ID && element1.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
                            this.state.taskFollowing1.push(element1);
                        }
                    });
                });
                this.setState({
                    tasklst: taskArr,
                    taskFollowing: this.state.taskFollowing,
                    taskFollowing1: this.state.taskFollowing1
                });
            } else {

            }
        });
    }
    searchFilterFunction = text => {
        this.setState({
            taskFollowing: this.state.taskFollowingStand,
            taskFollowing1: this.state.taskFollowingStand1,
            taskFollowing2: this.state.taskFollowingStand2,
        });
        if (this.state.TaskFollowingTab == 0) {
            const newData = this.state.taskFollowingStand.filter(item => {
                const itemData = `${item.MoTaCongViec.toUpperCase()} ${item.ID}`;
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            this.setState({
                taskFollowing: newData,
                taskFollowing1: this.state.taskFollowingStand1,
                taskFollowing2: this.state.taskFollowingStand2,
            });
        }
        if (this.state.TaskFollowingTab == 1) {
            const newData = this.state.taskFollowingStand1.filter(item => {
                const itemData = `${item.MoTaCongViec.toUpperCase()} ${item.ID}`;
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            this.setState({
                taskFollowing1: newData,
                taskFollowing: this.state.taskFollowingStand,
                taskFollowing2: this.state.taskFollowingStand2,
            });
        }
        if (this.state.TaskFollowingTab == 2) {
            const newData = this.state.taskFollowingStand2.filter(item => {
                const itemData = `${item.MoTaCongViec.toUpperCase()} ${item.ID}`;
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            this.setState({
                taskFollowing2: newData,
                taskFollowing: this.state.taskFollowingStand,
                taskFollowing1: this.state.taskFollowingStand1,
            });
        }

    };
    ChangeCollapse() {
        this.setState({
            collapse: !this.state.collapse
        });

    }
    TaskAdd(IDParent) {
        let params = { "MoTaCongViec": "Đầu việc mới", "Type": 1, "Ghim": false, "IDParent": IDParent };
        TaskService.ThemMoiCongViec(params).then((res) => {
            let taskObject = JSON.parse(res);
            // this.LoadTask();
            this.ChangePage('TaskEditScreen', taskObject.Data[0]);
        });
    }
    ChangeData(position) {
        if (position == 0) {
            this.setState({
                TaskFollowingTab: 0,
                // taskFollowing: this.state.taskAll[1].ListTask.Data,
                // taskFollowingStand: this.state.taskAll[1].ListTask.Data
            })
        }
        if (position == 1) {
            this.setState({
                TaskFollowingTab: 1,
                // taskFollowing: this.state.taskAll[2].ListTask.Data,
                // taskFollowingStand: this.state.taskAll[2].ListTask.Data
            })
        }
        if (position == 2) {
            this.setState({
                TaskFollowingTab: 2,
                // taskFollowing: this.state.taskAll[3].ListTask.Data,
                // taskFollowingStand: this.state.taskAll[3].ListTask.Data
            })
        }

    }
    myCallback = (dataFromChild) => {
        if (dataFromChild.Attribute == 'ChangeFollowingTab') {
            this.props.callbackFromParent({ Attribute: "ChangeFollowingTab", Tab: dataFromChild.Tab, CheckTab: dataFromChild.CheckTab });
        }
    }
    BackPage() {
        this.props.navigation.state.params.onGoBack(this.state.task);
        this.props.navigation.goBack();
    }
    ChangePage(page, params) {
        this.props.navigation.push(page, {
            params,
            onGoBack: (task) => this.refresh(task),
        });
    }
    refresh(task) {
        this.props.navigation.state;
        this.LoadTask();
    }
    render() {

        return (

            <View style={[styles.scene, { backgroundColor: '#EDEFF3' }]} >

                <View style={styles.header} >
                    <View style={{ flexDirection: 'row', }}>
                        <TouchableOpacity onPress={() => this.BackPage()}>
                            <Image
                                style={{ marginTop: 12, marginLeft: 10, marginRight: 24, height: 17, width: 9 }}
                                source={require('../../assets/icons/Arrow_left.png')}
                            />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 38 }}>
                            Việc con
                        </Text>

                    </View>
                    <View style={{ flexDirection: 'row', paddingLeft: 46 }}>
                        <Text numberOfLines={1} style={{ fontSize: 15, lineHeight: 38 }}>
                            Công việc cha: <Text style={{ fontSize: 15, fontWeight: 'bold', lineHeight: 38 }}>{this.state.task.MoTaCongViec}</Text>
                        </Text>
                    </View>
                </View>

                <View style={[{ flexDirection: "row", alignItems: 'center', marginTop: 25 }, this.state.taskFollowing.length > 0 || this.state.taskFollowing1.length > 0 ? { display: 'flex' } : { display: 'none' }]}>
                    <View style={{ flexDirection: "row", marginLeft: 15 }}>
                        <CheckboxModest
                            checked={this.state.TaskFollowingTab == 0}
                            label='Tôi thực hiện'
                            checkedComponent={<Image
                                labelStyle={{ color: '#5d5d5d', fontSize: 15, fontWeight: 'bold' }}
                                style={{ height: 14, width: 14 }}
                                source={require('../../assets/icons/check.png')} />}
                            uncheckedComponent={<Image
                                style={{ height: 14, width: 14, marginTop: 2 }}
                                source={require('../../assets/icons/uncheck.png')} />}
                            onChange={() => { this.ChangeData(0) }}
                        />
                    </View>
                    <View style={{ flexDirection: "row", flex: 1, justifyContent: 'center' }}>
                        <CheckboxModest
                            checked={this.state.TaskFollowingTab == 1}
                            label='Tôi giám sát'
                            checkedComponent={<Image
                                labelStyle={{ color: '#5d5d5d', fontSize: 15, fontWeight: 'bold', fontFamily: "Muli", }}
                                style={{ height: 14, width: 14 }}
                                source={require('../../assets/icons/check.png')} />}
                            uncheckedComponent={<Image
                                style={{ height: 14, width: 14, marginTop: 2 }}
                                source={require('../../assets/icons/uncheck.png')} />}
                            onChange={() => { this.ChangeData(1) }}
                        />
                    </View>
                </View>
                <View style={this.state.TaskFollowingTab == 0 ? { display: 'flex' } : { display: 'none' }}>
                    <FlatList
                        data={this.state.taskFollowing}
                        extraData={this.state}
                        keyExtractor={(item) => item.ID.toString()}
                        renderItem={({ item }) => <TaskBoxFollow navigation={this.props.navigation} taskFollowing={item} collapse={this.state.collapse} callbackFromParent={this.myCallback} />}
                        maxToRenderPerBatch={1}
                        windowSize={5}
                        onEndReachedThreshold={0.5}
                        removeClippedSubviews={true}
                        disableVirtualization={true}
                        maxToRenderPerBatch={1}
                        initialNumToRender={10}
                        contentContainerStyle={{ paddingBottom: 120 }}
                    />
                </View>
                <View style={this.state.TaskFollowingTab == 1 ? { display: 'flex' } : { display: 'none' }}>
                    <FlatList
                        data={this.state.taskFollowing1}
                        extraData={this.state}
                        keyExtractor={(item) => item.ID.toString()}
                        renderItem={({ item }) => <TaskBoxFollow navigation={this.props.navigation} taskFollowing={item} collapse={this.state.collapse} callbackFromParent={this.myCallback} />}
                        maxToRenderPerBatch={1}
                        windowSize={5}
                        onEndReachedThreshold={0.5}
                        removeClippedSubviews={true}
                        disableVirtualization={true}
                        maxToRenderPerBatch={1}
                        initialNumToRender={10}
                        contentContainerStyle={{ paddingBottom: 120 }}
                    />
                </View>
                <View style={this.state.taskFollowing.length == 0 && this.state.taskFollowing1.length == 0 ? { display: 'flex' } : { display: 'none' }}>
                    <Image
                        style={{ height: 22, width: 200, marginTop: 10, alignSelf: 'center' }}
                        source={require('../../assets/icons/empty-data.png')} />
                </View>
                <TouchableOpacity onPress={() => this.TaskAdd(this.state.task.ID)}>
                    <Image
                        style={{ height: 40, width: 136, marginTop: 26, alignSelf: 'center' }}
                        source={require('../../assets/icons/task-add.png')} />
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    scene: {
        flex: 1
    },
    header: {
        //Its for IOS
        shadowColor: 'rgba(0, 0, 0, 0.16)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        // its for android
        elevation: 5,
        position: 'relative',
        backgroundColor: '#FFF',
        height: 78,
    },
});