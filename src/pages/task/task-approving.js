import React, { Component } from "react";
import { AsyncStorage, TouchableOpacity, FlatList, View, Dimensions, style, TextInput, Text, Button, Icon, CheckBox, Alert, StyleSheet, Image } from "react-native";
import TaskBoxApprove from "./task-box-approve.js"
import SearchBar from 'react-native-material-design-searchbar';
import Checkbox from 'react-native-custom-checkbox';
import CheckboxModest from 'react-native-modest-checkbox'
import TaskService from "../../share/services/task.service";
import TaskUltilityService from "../../share/services/task-ultility.service";
import Moment from 'moment';
const GLOBAL = require('../../share/global.js');
export default class TaskApproving extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TaskApprovingTab: 0,
            collapse: false,
            taskAll: [],
            task: [],
            taskStand: [],

            taskAll1: [],
            task1: [],
            taskStand1: [],

            refreshing: false
        }
    }
    componentWillMount() {

    }
    FilterTask() {
        AsyncStorage.getItem('task').then((res) => {
            if (res) {
                let taskObject = JSON.parse(res);
                TaskUltilityService.TaskFilter(taskObject).then((res) => {
                    taskObject = res;
                    this.setState({
                        taskAll: taskObject,
                        task: taskObject[4].ListTask.Data,
                        taskStand: taskObject[4].ListTask.Data,

                        taskAll1: taskObject,
                        task1: taskObject[5].ListTask.Data,
                        taskStand1: taskObject[5].ListTask.Data,

                        refreshing: false
                    });

                }).catch(error => {
                    this.setState({
                        taskAll: taskObject,
                        task: taskObject[4].ListTask.Data,
                        taskStand: taskObject[4].ListTask.Data,

                        taskAll1: taskObject,
                        task1: taskObject[5].ListTask.Data,
                        taskStand1: taskObject[5].ListTask.Data,

                        refreshing: false
                    });
                }).then(() => {
                    TaskUltilityService.TaskSort(taskObject).then((res) => {
                        taskObject = res;
                        this.setState({
                            taskAll: taskObject,
                            task: taskObject[4].ListTask.Data,
                            taskStand: taskObject[4].ListTask.Data,

                            taskAll1: taskObject,
                            task1: taskObject[5].ListTask.Data,
                            taskStand1: taskObject[5].ListTask.Data,

                            refreshing: false
                        });
                    }).catch(error => {
                        this.setState({
                            taskAll: taskObject,
                            task: taskObject[4].ListTask.Data,
                            taskStand: taskObject[4].ListTask.Data,

                            taskAll1: taskObject,
                            task1: taskObject[5].ListTask.Data,
                            taskStand1: taskObject[5].ListTask.Data,

                            refreshing: false
                        });
                    });

                });
            } else {
                this.TaskList();
            }
        });
    }

    handleRefesh = () => {
        this.setState({
            refreshing: true
        })
        TaskUltilityService.TaskListAll().then((res) => {
            let result = JSON.parse(res);
            if (result) {
                this.FilterTask();
            }
        });

    }
    componentDidMount() {
        AsyncStorage.getItem('taskConfig').then((res, error) => {
            if (res) {
                let taskConfig = JSON.parse(res);
                this.setState({
                    TaskApprovingTab: taskConfig.TaskApprovingTab,
                })
            } else {
                let taskConfig = {
                    index: 2,
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
        this.FilterTask();
    }
    TaskList() {
        let today = new Date();
        let date2 = new Date(new Date().setDate(today.getDate() - 30));
        let dateStart = Moment(date2).format('YYYY-MM-DDT00-00-01');
        let dateEnd = Moment(today).format('YYYY-MM-DDT23-59-59')
        let param = {
            "request": [{ "Page": 1, "PageSize": 50, "GroupType": 3, "Filter": "(IDTrangThai~neq~8~and~IDTrangThai~neq~4~and~IDTrangThai~neq~3~and~IDTrangThai~neq~10~and~IDTrangThai~neq~9)", "Sort": "LevelCode-asc" },
            { "Page": 1, "PageSize": 50, "GroupType": 7, "Filter": "NgayDuyet~gte~datetime'" + dateStart + "'~and~NgayDuyet~lt~datetime'" + dateEnd + "'", "Sort": "LevelCode-asc" }]
        }
        TaskService.GetData(param).then((res) => {
            let taskObject = JSON.parse(res)
            taskObject.unshift({});
            taskObject.unshift({});
            taskObject.unshift({});
            taskObject.unshift({});
            // if (this.state.TaskApprovingTab == 0) {
            this.setState({
                taskAll: taskObject,
                task: taskObject[4].ListTask.Data,
                taskStand: taskObject[4].ListTask.Data
            });
            // }
            // if (this.state.TaskApprovingTab == 1) {
            this.setState({
                taskAll1: taskObject,
                task1: taskObject[5].ListTask.Data,
                taskStand1: taskObject[5].ListTask.Data
            });
            // }
        });
    }
    searchFilterFunction = text => {
        this.setState({
            task: this.state.taskStand,
            task1: this.state.taskStand1,
        });
        if (this.state.TaskApprovingTab == 0) {
            const newData = this.state.taskStand.filter(item => {
                const itemData = `${item.MoTaCongViec.toUpperCase()} ${item.ID}`;
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            this.setState({
                task: newData,
            });
        }
        if (this.state.TaskApprovingTab == 1) {
            const newData = this.state.taskStand1.filter(item => {
                const itemData = `${item.MoTaCongViec.toUpperCase()} ${item.ID}`;
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            this.setState({
                task1: newData,
            });
        }
    };
    ChangeCollapse() {
        this.setState({ collapse: !this.state.collapse });
    }
    ChangeData(position) {
        if (position == 0) {
            this.setState({
                TaskApprovingTab: 0,
                // task: this.state.taskAll[4].ListTask.Data,
                // taskStand: this.state.taskAll[4].ListTask.Data
            })
        }
        if (position == 1) {
            this.setState({
                TaskApprovingTab: 1,
                // task: this.state.taskAll[5].ListTask.Data,
                // taskStand: this.state.taskAll[5].ListTask.Data
            })
        }
    }
    myCallback = (dataFromChild) => {
        if (dataFromChild.Attribute == 'ChangeFollowingTab') {
            this.props.callbackFromParent({ Attribute: "ChangeFollowingTab", Tab: dataFromChild.Tab, CheckTab: dataFromChild.CheckTab });
        }
        if (dataFromChild.Attribute == 'RefeshData') {
            this.TaskList();
        }
    }
    ChangePage(page, params) {
        this.props.navigation.navigate(page, {
            params,
            onGoBack: (task) => this.refresh(task),
        });
    }
    refresh(task) {
        this.props.navigation.state;
        this.FilterTask();
    }
    render() {
        return (

            <View style={[styles.scene, { backgroundColor: '#EDEFF3' }]} >
                <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 10 }}>
                    <View style={{
                        backgroundColor: '#ecf0f1',
                        marginLeft: 15,
                        marginRight: 15,
                        borderRadius: 3,
                        flex: 1,
                    }}>
                        <SearchBar
                            onSearchChange={text => this.searchFilterFunction(text)}
                            height={32}
                            iconBackName='md-search'
                            onFocus={() => console.log('On Focus')}
                            onBlur={() => console.log('On Blur')}
                            placeholder={'Tìm kiếm...'}
                            inputStyle={{ borderRadius: 3, backgroundColor: '#FFF', borderColor: "#FFF" }}
                            textStyle={{ padding: 0, fontFamily: "Muli", fontSize: 15, color: "#5d5d5d", backgroundColor: '#FFF' }}
                            padding={0}
                            iconColor={'#5d5d5d'}
                            autoCorrect={false}
                            returnKeyType={'search'}
                        />
                    </View>
                    <TouchableOpacity onPress={() => { this.ChangeCollapse() }}>
                        <Image
                            style={{ marginRight: 20, height: 18, width: 29 }}
                            source={(this.state.collapse) ? require('../../assets/icons/EyeActive.png') : require('../../assets/icons/eye.png')}

                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.ChangePage('TaskSortScreen')}>
                        <Image
                            style={{ marginRight: 20, height: 20, width: 20 }}
                            source={require('../../assets/icons/Sort.png')}
                            onPress={this.changeLogo}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.ChangePage('TaskFilterScreen')}>
                        <Image
                            style={{ marginRight: 15, height: 20, width: 20 }}
                            source={require('../../assets/icons/Filter.png')}
                            onPress={this.changeLogo}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 25 }}>
                    <View style={{ flexDirection: "row", marginLeft: 15 }}>
                        <CheckboxModest
                            checked={this.state.TaskApprovingTab == 0}
                            label='Cần duyệt'
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
                    <View style={{ flexDirection: "row", flex: 1, marginLeft: 30 }}>
                        <CheckboxModest
                            checked={this.state.TaskApprovingTab == 1}
                            label='Đã duyệt'
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
                <View style={this.state.TaskApprovingTab == 0 ? { display: 'flex' } : { display: 'none' }}>

                    <FlatList
                        data={this.state.task}
                        extraData={this.state.collapse}
                        keyExtractor={(item) => item.ID.toString()}

                        renderItem={({ item }) => <TaskBoxApprove navigation={this.props.navigation} taskApproving={item} collapse={this.state.collapse} callbackFromParent={this.myCallback} />}
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefesh}
                        contentContainerStyle={{ paddingBottom: 120 }}
                    />
                </View>
                <View style={this.state.TaskApprovingTab == 1 ? { display: 'flex' } : { display: 'none' }}>

                    <FlatList
                        data={this.state.task1}
                        extraData={this.state.collapse}
                        keyExtractor={(item) => item.ID.toString()}

                        renderItem={({ item }) => <TaskBoxApprove navigation={this.props.navigation} taskApproving={item} collapse={this.state.collapse} callbackFromParent={this.myCallback} />}
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefesh}
                        contentContainerStyle={{ paddingBottom: 120 }}
                    />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    scene: {
        height: Dimensions.get('window').height
    },
});