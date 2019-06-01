import * as React from 'react';
import { ActivityIndicator, AsyncStorage, View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Moment from 'moment';
import TaskWaiting from './task-waiting.js'
import TaskFollowing from './task-following.js'
import TaskApproving from './task-approving.js'
import TaskService from "../../share/services/task.service";
const GLOBAL = require('../../share/global.js');
export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            TaskFollowingTab: 0,
            TaskApprovingTab: 0,
            routes: [
                { key: 'first', title: 'Chờ giao' },
                { key: 'second', title: 'Theo dõi' },
                { key: 'third', title: 'Duyệt' },
            ],
            isLoading: false,
        };
        console.log('header loaded');
    }
    componentWillMount() {
        AsyncStorage.getItem('taskConfig').then((res, error) => {
            if (res) {
                let taskConfig = JSON.parse(res);
                // this.setState({
                //     // index: 1,
                //     index: taskConfig.index,
                //     TaskFollowingTab: taskConfig.TaskFollowingTab,
                //     TaskApprovingTab: taskConfig.TaskApprovingTab
                // })
            } else {
                let taskConfig = {
                    index: 0,
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
        FirstRoute = () => (
            <TaskWaiting navigation={this.props.navigation} callbackFromParent={this.myCallback} />
        );
        SecondRoute = () => (
            <TaskFollowing navigation={this.props.navigation} callbackFromParent={this.myCallback} />
        );
        ThirdRoute = () => (
            <TaskApproving navigation={this.props.navigation} callbackFromParent={this.myCallback} />
        );
        AsyncStorage.getItem('task').then((res, error) => {
            if (res) {

            } else {
                this.setState({ isLoading: true });
                this.TaskList();
            }
            console.log(res);
        });

    }
    componentDidMount() {


    }
    TaskList() {
        let today = new Date();
        let date2 = new Date(new Date().setDate(today.getDate() - 30));
        let dateStart = Moment(date2).format('YYYY-MM-DDT00-00-01');
        let dateEnd = Moment(today).format('YYYY-MM-DDT23-59-59');
        let param = {
            "request": [
                { "Page": 1, "PageSize": 50, "GroupType": 1, "Filter": "(IDTrangThai~neq~8~and~IDTrangThai~neq~4~and~IDTrangThai~neq~3~and~IDTrangThai~neq~10~and~IDTrangThai~neq~9)", "Sort": "LevelCode-asc" },
                { "Page": 1, "PageSize": 50, "GroupType": 2, "Filter": "(Today~eq~true~or~Trehan~eq~true)~and~(IDTrangThai~neq~8~and~IDTrangThai~neq~4~and~IDTrangThai~neq~3~and~IDTrangThai~neq~10~and~IDTrangThai~neq~9)", "Sort": "LevelCode-asc" },
                { "Page": 1, "PageSize": 50, "GroupType": 4, "Filter": "(Today~eq~true~or~Trehan~eq~true)~and~(IDTrangThai~neq~8~and~IDTrangThai~neq~4~and~IDTrangThai~neq~3~and~IDTrangThai~neq~10~and~IDTrangThai~neq~9)", "Sort": "NgayDoiTinhTrang-asc" },
                { "Page": 1, "PageSize": 50, "GroupType": 8, "Filter": "NgayDuyet~gte~datetime'" + dateStart + "'~and~NgayDuyet~lt~datetime'" + dateEnd + "'", "Sort": "LevelCode-asc" },
                { "Page": 1, "PageSize": 50, "GroupType": 3, "Filter": "(IDTrangThai~neq~8~and~IDTrangThai~neq~4~and~IDTrangThai~neq~3~and~IDTrangThai~neq~10~and~IDTrangThai~neq~9)", "Sort": "LevelCode-asc" },
                { "Page": 1, "PageSize": 50, "GroupType": 7, "Filter": "NgayDuyet~gte~datetime'" + dateStart + "'~and~NgayDuyet~lt~datetime'" + dateEnd + "'", "Sort": "LevelCode-asc" }
            ]
        }
        TaskService.GetData(param).then((res) => {
            let taskWaitingObject = JSON.parse(res)
            this.setState({ isLoading: false });
            try {
                AsyncStorage.setItem('task', res);
            } catch (error) {
                console.log("Error saving data" + error);
            }
        });
    }

    // ChangePage() {
    //     this.props.navigation.navigate('TaskEditScreen');
    // }
    myCallback = (dataFromChild) => {
        SecondRoute = () => (
            <TaskFollowing navigation={this.props.navigation} callbackFromParent={this.myCallback} />
        );
        ThirdRoute = () => (
            <TaskApproving navigation={this.props.navigation} callbackFromParent={this.myCallback} />
        );
        AsyncStorage.getItem('taskConfig').then((res, error) => {
            if (res) {
                let taskConfig = JSON.parse(res);
                this.setState({
                    // index: 1,
                    index: taskConfig.index,
                    TaskFollowingTab: taskConfig.TaskFollowingTab,
                    TaskApprovingTab: taskConfig.TaskApprovingTab
                })
            } else {
                let taskConfig = {
                    index: 0,
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
    }
    changeIndex(index) {
        this.setState({ index: index })
    }
    render() {
        if (this.state.isLoading) {
            return (<View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(255,255,255, 0.6)' }}>
                <ActivityIndicator size="large" color="#F1802E" />
                <Text style={{ color: '#F1802E', textAlign: "center" }}>
                    Đang khởi tạo dữ liệu task
            </Text>

            </View>);
        }
        return (
            //             <View>
            // <TouchableOpacity onPress={this.ChangePage()} style={{ marginRight: 15 }}>
            //                     <Text style={{ height: 32, lineHeight: 32, color: "#5d5d5d", alignSelf: 'flex-end', }}>
            //                         Giao việcs
            //                         </Text>
            //                 </TouchableOpacity>
            //             </View>
            <View style={styles.scene}>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: FirstRoute,
                        second: SecondRoute,
                        // second: () => <TaskFollowing navigation={this.props.navigation} callbackFromParent={this.myCallback} />,
                        third: ThirdRoute,
                    })}

                    onIndexChange={(index) => this.changeIndex(index)}
                    initialLayout={{ width: Dimensions.get('window').width, height: 55 }}
                    renderTabBar={(props) =>
                        <TabBar
                            {...props}
                            getLabelText={({ route }) => route.title}
                            style={{ backgroundColor: "white" }}
                            labelStyle={{ fontWeight: 'bold' }}
                            activeColor={"#F1802E"}
                            inactiveColor={"#5D5D5D"}
                            indicatorStyle={{ backgroundColor: "#F1802E" }}
                        />
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scene: {
        height: Dimensions.get('window').height,
        color: 'red'
    },
});