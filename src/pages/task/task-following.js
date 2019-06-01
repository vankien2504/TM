import React, { Component } from "react";
import { ScrollView, AsyncStorage, TouchableOpacity, FlatList, View, Dimensions, style, TextInput, Text, Button, Icon, CheckBox, Alert, StyleSheet, Image } from "react-native";
import TaskBoxFollow from "./task-box-follow.js"
import SearchBar from 'react-native-material-design-searchbar';
import Checkbox from 'react-native-custom-checkbox';
import CheckboxModest from 'react-native-modest-checkbox'
import TaskService from "../../share/services/task.service";
import TaskUltilityService from "../../share/services/task-ultility.service";
import Moment from 'moment';
const GLOBAL = require('../../share/global.js');
export default class TaskFollowing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TaskFollowingTab: 0,
            collapse: false,
            taskAll: [],
            taskFollowing: [],
            taskFollowingStand: [],

            taskAll1: [],
            taskFollowing1: [],
            taskFollowingStand1: [],

            taskAll2: [],
            taskFollowing2: [],
            taskFollowingStand2: [],

            refreshing: false
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

        this.FilterTask();
    }
    FilterTask() {
        AsyncStorage.getItem('task').then((res) => {
            if (res) {
                let taskObject = JSON.parse(res);
                TaskUltilityService.TaskFilter(taskObject).then((res) => {
                    taskObject = res;
                    this.setState({
                        taskAll: taskObject,
                        taskFollowing: taskObject[1].ListTask.Data,
                        taskFollowingStand: taskObject[1].ListTask.Data,

                        taskAll1: taskObject,
                        taskFollowing1: taskObject[2].ListTask.Data,
                        taskFollowingStand1: taskObject[2].ListTask.Data,

                        taskAll2: taskObject,
                        taskFollowing2: taskObject[3].ListTask.Data,
                        taskFollowingStand2: taskObject[3].ListTask.Data,

                        refreshing: false
                    });

                }).catch(error => {
                    this.setState({
                        taskAll: taskObject,
                        taskFollowing: taskObject[1].ListTask.Data,
                        taskFollowingStand: taskObject[1].ListTask.Data,

                        taskAll1: taskObject,
                        taskFollowing1: taskObject[2].ListTask.Data,
                        taskFollowingStand1: taskObject[2].ListTask.Data,

                        taskAll2: taskObject,
                        taskFollowing2: taskObject[3].ListTask.Data,
                        taskFollowingStand2: taskObject[3].ListTask.Data,

                        refreshing: false
                    });
                }).then(() => {
                    TaskUltilityService.TaskSort(taskObject).then((res) => {
                        taskObject = res;
                        this.setState({
                            taskAll: taskObject,
                            taskFollowing: taskObject[1].ListTask.Data,
                            taskFollowingStand: taskObject[1].ListTask.Data,

                            taskAll1: taskObject,
                            taskFollowing1: taskObject[2].ListTask.Data,
                            taskFollowingStand1: taskObject[2].ListTask.Data,

                            taskAll2: taskObject,
                            taskFollowing2: taskObject[3].ListTask.Data,
                            taskFollowingStand2: taskObject[3].ListTask.Data,

                            refreshing: false
                        });
                    }).catch(error => {
                        this.setState({
                            taskAll: taskObject,
                            taskFollowing: taskObject[1].ListTask.Data,
                            taskFollowingStand: taskObject[1].ListTask.Data,

                            taskAll1: taskObject,
                            taskFollowing1: taskObject[2].ListTask.Data,
                            taskFollowingStand1: taskObject[2].ListTask.Data,

                            taskAll2: taskObject,
                            taskFollowing2: taskObject[3].ListTask.Data,
                            taskFollowingStand2: taskObject[3].ListTask.Data,

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

    TaskList() {
        let today = new Date();
        let date2 = new Date(new Date().setDate(today.getDate() - 30));
        let dateStart = Moment(date2).format('YYYY-MM-DDT00-00-01');
        let dateEnd = Moment(today).format('YYYY-MM-DDT23-59-59')
        let param = {
            "request": [
                { "Page": 1, "PageSize": 50, "GroupType": 2, "Filter": "(Today~eq~true~or~Trehan~eq~true)~and~(IDTrangThai~neq~8~and~IDTrangThai~neq~4~and~IDTrangThai~neq~3~and~IDTrangThai~neq~10~and~IDTrangThai~neq~9)~and~IDNhanSuThucHienChinh~eq~" + GLOBAL.userInfo.IDNhanSu, "Sort": "LevelCode-asc" },
                { "Page": 1, "PageSize": 50, "GroupType": 4, "Filter": "(Today~eq~true~or~Trehan~eq~true)~and~(IDTrangThai~neq~8~and~IDTrangThai~neq~4~and~IDTrangThai~neq~3~and~IDTrangThai~neq~10~and~IDTrangThai~neq~9)", "Sort": "NgayDoiTinhTrang-asc" },
                { "Page": 1, "PageSize": 50, "GroupType": 8, "Filter": "NgayDuyet~gte~datetime'" + dateStart + "'~and~NgayDuyet~lt~datetime'" + dateEnd + "'", "Sort": "LevelCode-asc" }]
        }
        TaskService.GetData(param).then((res) => {
            let taskFollowingObject = JSON.parse(res)
            taskFollowingObject.unshift({});
            // if (this.state.TaskFollowingTab == 0) {
            this.setState({
                taskAll: taskFollowingObject,
                taskFollowing: taskFollowingObject[1].ListTask.Data,
                taskFollowingStand: taskFollowingObject[1].ListTask.Data
            });
            // }
            // if (this.state.TaskFollowingTab == 1) {
            this.setState({
                taskAll1: taskFollowingObject,
                taskFollowing1: taskFollowingObject[2].ListTask.Data,
                taskFollowingStand1: taskFollowingObject[2].ListTask.Data
            });
            // }
            // if (this.state.TaskFollowingTab == 2) {
            this.setState({
                taskAll2: taskFollowingObject,
                taskFollowing2: taskFollowingObject[3].ListTask.Data,
                taskFollowingStand2: taskFollowingObject[3].ListTask.Data
            });
            // }
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
        if (dataFromChild.Attribute == 'ChangeApprovingTab') {
            this.props.callbackFromParent({ Attribute: "ChangeApprovingTab", Tab: dataFromChild.Tab, CheckTab: dataFromChild.CheckTab });
        }
        if (dataFromChild.Attribute == 'ChangeData') {
            this.FilterTask();
        }
    }
    ChangePage(page, params) {
        this.props.navigation.navigate(page, {
            params,
            onGoBack: (task, fatherBack) => this.refresh(task)
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
                    <TouchableOpacity onPress={() => this.ChangeCollapse()}>
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
                            checked={this.state.TaskFollowingTab == 0}
                            label='Theo dõi'
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
                            label='Chờ duyệt'
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
                    <View style={{ flexDirection: "row", marginRight: 5 }}>
                        <CheckboxModest
                            checked={this.state.TaskFollowingTab == 2}
                            label='Kết thúc'
                            checkedComponent={<Image
                                labelStyle={{ color: '#5d5d5d', fontSize: 15, fontWeight: 'bold' }}
                                style={{ height: 14, width: 14 }}
                                source={require('../../assets/icons/check.png')} />}
                            uncheckedComponent={<Image
                                style={{ height: 14, width: 14, marginTop: 2 }}
                                source={require('../../assets/icons/uncheck.png')} />}
                            onChange={() => { this.ChangeData(2) }}
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
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefesh}
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
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefesh}
                        windowSize={5}
                        onEndReachedThreshold={0.5}
                        removeClippedSubviews={true}
                        disableVirtualization={true}
                        maxToRenderPerBatch={1}
                        initialNumToRender={10}
                        contentContainerStyle={{ paddingBottom: 120 }}
                    />
                </View>
                <View style={this.state.TaskFollowingTab == 2 ? { display: 'flex' } : { display: 'none' }}>
                    <FlatList
                        data={this.state.taskFollowing2}
                        extraData={this.state}
                        keyExtractor={(item) => item.ID.toString()}
                        renderItem={({ item }) => <TaskBoxFollow navigation={this.props.navigation} taskFollowing={item} collapse={this.state.collapse} callbackFromParent={this.myCallback} />}
                        maxToRenderPerBatch={1}
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefesh}
                        windowSize={5}
                        onEndReachedThreshold={0.5}
                        removeClippedSubviews={true}
                        disableVirtualization={true}
                        maxToRenderPerBatch={1}
                        initialNumToRender={10}
                        contentContainerStyle={{ paddingBottom: 120 }}
                    />

                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    scene: {
        flex: 1
    },
});