import React, { Component } from "react";
import { AsyncStorage, FlatList, TouchableOpacity, Image, View, Dimensions, style, TextInput, Text, Button, CheckBox, Alert, StyleSheet } from "react-native";
import TaskBox from "./task-box.js"
import moment from 'moment';
// import { SearchBar } from 'react-native-elements'
import SearchBar from 'react-native-material-design-searchbar';
import TaskService from "../../share/services/task.service";
import TaskUltilityService from "../../share/services/task-ultility.service";
const GLOBAL = require('../../share/global.js');
import ActionButton from 'react-native-action-button';
export default class TaskWaiting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskWaiting: [],
            taskWaitingStand: [],
            refreshing: false
        }
        console.log('tast loaded');
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
    componentWillMount() {
        this.FilterTask();
    }
    FindArrayInArray(arr1, arr2) {
        let flag = 0;
        arr1.forEach(element => {
            if (arr2.indexOf(element.ID) > -1) {
                flag++;
            }
        });
        if (flag > 0) {
            return true;
        } else {
            return false;
        }

    }
    FilterTask() {
        AsyncStorage.getItem('task').then((res) => {
            if (res) {
                let taskWaitingObject = JSON.parse(res);
                TaskUltilityService.TaskFilter(taskWaitingObject).then((res) => {
                    taskWaitingObject = res;
                    this.setState({
                        taskWaiting: taskWaitingObject[0].ListTask.Data,
                        taskWaitingStand: taskWaitingObject[0].ListTask.Data,
                        refreshing: false
                    });
                }).catch(error => {
                    this.setState({
                        taskWaiting: taskWaitingObject[0].ListTask.Data,
                        taskWaitingStand: taskWaitingObject[0].ListTask.Data,
                        refreshing: false
                    });
                }).then(() => {
                    TaskUltilityService.TaskSort(taskWaitingObject).then((res) => {
                        taskWaitingObject = res;
                        this.setState({
                            taskWaiting: taskWaitingObject[0].ListTask.Data,
                            taskWaitingStand: taskWaitingObject[0].ListTask.Data,
                            refreshing: false
                        });
                    }).catch(error => {
                        this.setState({
                            taskWaiting: taskWaitingObject[0].ListTask.Data,
                            taskWaitingStand: taskWaitingObject[0].ListTask.Data,
                            refreshing: false
                        });
                    });

                });
            } else {
                this.TaskList();
            }
        });
    }
    componentDidMount() {
        // this.TaskList();
        // this.TaskListAll();
    }
    TaskList() {
        let param = {
            "request": [
                { "Page": 1, "PageSize": 50, "GroupType": 1, "Filter": "(IDTrangThai~neq~8~and~IDTrangThai~neq~4~and~IDTrangThai~neq~3~and~IDTrangThai~neq~10~and~IDTrangThai~neq~9)", "Sort": "LevelCode-asc" },
            ]
        }
        TaskService.GetData(param).then((res) => {
            let taskWaitingObject = JSON.parse(res)
            this.setState({
                taskWaiting: taskWaitingObject[0].ListTask.Data,
                taskWaitingStand: taskWaitingObject[0].ListTask.Data
            });
        });
    }
    SearchTask(Name) {
        let arrayTemp = [];
        for (i = 0; i < this.state.taskWaitingStand.length; i++) {
            let MoTaCongViec = this.state.taskWaitingStand[i].MoTaCongViec;
            if (MoTaCongViec.indexOf(Name.toLowerCase()) > -1) {
                arrayTemp.push(this.state.taskWaitingStand[i]);
            }
        }
        this.setState({
            taskWaiting: arrayTemp
        })
    }
    TaskAdd() {
        let params = { "MoTaCongViec": "Đầu việc mới", "Type": 1, "Ghim": false };
        TaskService.ThemMoiCongViec(params).then((res) => {
            let taskObject = JSON.parse(res);
            // this.TaskListAll();
            this.ChangePage('TaskEditScreen', taskObject.Data[0]);
        });
    }
    myCallback = (dataFromChild) => {
        if (dataFromChild.Attribute == 'ChangeFollowingTab') {
            this.props.callbackFromParent({ Attribute: "ChangeFollowingTab", Tab: dataFromChild.Tab, CheckTab: dataFromChild.CheckTab });
        }

        if (dataFromChild.Attribute == 'ChangeData') {
            this.props.callbackFromParent({ Attribute: "ChangeData", Tab: dataFromChild.Tab, CheckTab: dataFromChild.CheckTab });
            // this.TaskList();
        }
    }
    searchFilterFunction = text => {
        const newData = this.state.taskWaitingStand.filter(item => {
            const itemData = `${item.MoTaCongViec.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            taskWaiting: newData
        });
    };
    _listEmptyComponent = () => {
        return (
            <View>
            // any activity indicator or error component
            </View>
        )
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
    render() {
        return (

            <View style={{ flex: 1 }}>

                <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 10, marginBottom: 24 }}>
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
                        {/* <Search
                            ref="search_box"
                            inputStyle={{ padding: 0, margin: 0, backgroundColor: 'red' }}
                            inputHeight={32}
                            inputBorderRadius={3}
                            onChangeText={text => this.searchFilterFunction(text)}
                            placeholder="Tìm kiếm..."
                        /> */}
                        {/* <SearchBar
                            style={{ flex: 1, backgroundColor: 'white', borderRadius: 3 }}
                            clearIcon={{ color: 'red', height: 32 }}
                            lightTheme
                            searchIcon={{ size: 20, width: null, backgroundColor: 'black', top: -5 }}
                            // onChangeText={(value) => this.SearchTask(value)}
                            onChangeText={text => this.searchFilterFunction(text)}
                            // onClear={someMethod}
                            inputStyle={{ height: 30, margin: 0, padding: 0, backgroundColor: '#FFF', fontFamily: "Muli", fontSize: 15, color: "#c3c3c3" }}
                            inputContainerStyle={{}}
                            containerStyle={{ backgroundColor: 'red', borderRadius: 3, height: 32, }}
                            placeholder='Tìm kiếm...' /> */}
                    </View>
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

                <View style={this.state.taskWaiting.length > 0 ? { display: 'flex' } : { display: 'none' }}>

                    <FlatList
                        data={this.state.taskWaiting}
                        extraData={this.state}
                        keyExtractor={(item) => item.ID.toString()}
                        renderItem={({ item }) => <TaskBox navigation={this.props.navigation} taskWaiting={item} callbackFromParent={this.myCallback} />}
                        maxToRenderPerBatch={1}
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefesh}
                        windowSize={5}
                        onEndReachedThreshold={0.5}
                        removeClippedSubviews={true}
                        disableVirtualization={true}
                        maxToRenderPerBatch={1}
                        initialNumToRender={5}
                        contentContainerStyle={{ paddingBottom: 120 }}
                    />
                </View>


                <ActionButton
                    style={{ position: 'absolute', bottom: 60, right: 0 }}
                    buttonColor="#F1802E"
                    size={50}
                    onPress={() => this.TaskAdd()}
                />


            </View>
            // <View style={[styles.scene, { backgroundColor: '#EDEFF3' }]}>
            //     {
            //         this.state.response.map((taskWaiting) => {
            //             return (<TaskBox taskWaiting={taskWaiting} callbackFromParent={this.myCallback} />);
            //         })
            //     }

            // </View>
        );
    }
}
const styles = StyleSheet.create({
    scene: {
        height: Dimensions.get('window').height
    },
    TouchableOpacityStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },

    FloatingButtonStyle: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        //backgroundColor:'black'
    },
});