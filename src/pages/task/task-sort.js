import React, { Component } from "react";
import { AsyncStorage, Image, TouchableOpacity, View, Dimensions, style, TextInput, Text, Button, CheckBox, Alert, StyleSheet } from "react-native";
export default class TaskSort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortTask: {}
        }
    }
    componentWillMount() {
        AsyncStorage.getItem('sortTask').then((res, error) => {
            if (res) {
                let sortTaskObject = JSON.parse(res)

                this.setState({
                    sortTask: sortTaskObject
                });
            } else {
                let sortTask = {
                    sortBy: true,
                    sortType: 1
                }
                this.setState({
                    sortTask: sortTask
                });
                try {
                    AsyncStorage.setItem('sortTask', JSON.stringify(sortTask));
                } catch (error) {
                    console.log("Error saving data" + error);
                }
            }
        });
    }
    ChangeSortType(type) {
        this.state.sortTask.sortType = type;
        this.setState({ sortTask: { ...this.state.sortTask, sortType: type } });
        try {
            AsyncStorage.setItem('sortTask', JSON.stringify(this.state.sortTask));
        } catch (error) {
            console.log("Error saving data" + error);
        }
    }
    ChangeSortBy(type) {
        this.state.sortTask.sortBy = type;
        this.setState({ sortTask: { ...this.state.sortTask, sortBy: type } });
        try {
            AsyncStorage.setItem('sortTask', JSON.stringify(this.state.sortTask));
        } catch (error) {
            console.log("Error saving data" + error);
        }
    }
    refresh(task) {
        this.props.navigation.state;
    }

    BackPage(type) {
        if (type == 'close') {
            let keys = ['sortTask'
            ];
            AsyncStorage.multiRemove(keys, (err) => {

            });
        } else {

        }
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
    }
    render() {
        return (
            <View style={[styles.scene, { backgroundColor: '#EDEFF3' }]} >
                <View style={[styles.shadow, { height: 54, flexDirection: 'row', backgroundColor: '#FFF' }]} >
                    <TouchableOpacity onPress={() => this.BackPage('close')}>
                        <Image
                            style={{ marginTop: 17, marginLeft: 10, marginRight: 14, height: 25, width: 25 }}
                            source={require('../../assets/icons/close.png')}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 54, flex: 1 }}>
                        Sắp xếp
                </Text>
                    <TouchableOpacity onPress={() => this.BackPage('apply')}>
                        <Text style={{ fontSize: 15, lineHeight: 54, color: '#0092FF', marginRight: 16, marginLeft: 16 }}>
                            Áp dụng
                </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 50, flexDirection: 'row' }} >
                    <Text style={{ marginLeft: 16, fontSize: 15, fontWeight: 'bold', lineHeight: 50 }}>
                        Sắp xếp theo
                        </Text>
                </View>
                <View style={{ flexDirection: 'row', height: 40 }}>
                    <TouchableOpacity onPress={() => this.ChangeSortBy(true)} style={{ flex: 1, backgroundColor: '#FFF', borderRightWidth: 1, borderRightColor: '#C3C3C3' }}>
                        <View style={{ alignSelf: 'center', flexDirection: 'row', height: 40, }}>
                            <Text style={{ lineHeight: 40, paddingLeft: 16, marginRight: 15 }}>
                                Tăng dần
                            </Text>
                            <Image
                                style={{ marginTop: 11, marginRight: 16, height: 20, width: 20 }}
                                source={(!this.state.sortTask.sortBy) ? require('../../assets/icons/radioCheck.png') : require('../../assets/icons/radioCheckActive.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.ChangeSortBy(false)} style={{ flex: 1, backgroundColor: '#FFF', }}>
                        <View style={{ alignSelf: 'center', flexDirection: 'row', height: 40, backgroundColor: '#FFF', }}>
                            <Text style={{ lineHeight: 40, paddingLeft: 16, marginRight: 15 }}>
                                Giảm dần
                            </Text>
                            <Image
                                style={{ marginTop: 11, marginRight: 16, height: 20, width: 20 }}
                                source={(this.state.sortTask.sortBy) ? require('../../assets/icons/radioCheck.png') : require('../../assets/icons/radioCheckActive.png')}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 50, flexDirection: 'row' }} >
                    <Text style={{ marginLeft: 16, fontSize: 15, fontWeight: 'bold', lineHeight: 50 }}>
                        Đối tượng sắp xếp
                        </Text>
                </View>
                <TouchableOpacity onPress={() => this.ChangeSortType(1)}>
                    <View style={{ flexDirection: 'row', height: 40, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#C3C3C3' }}>
                        <Text style={{ lineHeight: 40, paddingLeft: 16, flex: 1 }}>
                            Tên công việc
                                    </Text>
                        <Image
                            style={{ marginTop: 11, marginRight: 16, height: 20, width: 20 }}
                            source={(this.state.sortTask.sortType == 1) ? require('../../assets/icons/radioCheckActive.png') : require('../../assets/icons/radioCheck.png')}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.ChangeSortType(2)}>
                    <View style={{ flexDirection: 'row', height: 40, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#C3C3C3' }}>
                        <Text style={{ lineHeight: 40, paddingLeft: 16, flex: 1 }}>
                            Mức độ ưu tiên
                                    </Text>
                        <Image
                            style={{ marginTop: 11, marginRight: 16, height: 20, width: 20 }}
                            source={(this.state.sortTask.sortType == 2) ? require('../../assets/icons/radioCheckActive.png') : require('../../assets/icons/radioCheck.png')}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>this.ChangeSortType(3)}>
                    <View style={{ flexDirection: 'row', height: 40, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#C3C3C3' }}>
                        <Text style={{ lineHeight: 40, paddingLeft: 16, flex: 1 }}>
                            Tiến độ
                                    </Text>
                        <Image
                            style={{ marginTop: 11, marginRight: 16, height: 20, width: 20 }}
                            source={(this.state.sortTask.sortType == 3) ? require('../../assets/icons/radioCheckActive.png') : require('../../assets/icons/radioCheck.png')}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.ChangeSortType(4)}>
                    <View style={{ flexDirection: 'row', height: 40, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#C3C3C3' }}>
                        <Text style={{ lineHeight: 40, paddingLeft: 16, flex: 1 }}>
                            Thời gian bắt đầu
                                    </Text>
                        <Image
                            style={{ marginTop: 11, marginRight: 16, height: 20, width: 20 }}
                            source={(this.state.sortTask.sortType == 4) ? require('../../assets/icons/radioCheckActive.png') : require('../../assets/icons/radioCheck.png')}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.ChangeSortType(5)}>
                    <View style={{ flexDirection: 'row', height: 40, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#C3C3C3' }}>
                        <Text style={{ lineHeight: 40, paddingLeft: 16, flex: 1 }}>
                            Thời hạn
                                    </Text>
                        <Image
                            style={{ marginTop: 11, marginRight: 16, height: 20, width: 20 }}
                            source={(this.state.sortTask.sortType == 5) ? require('../../assets/icons/radioCheckActive.png') : require('../../assets/icons/radioCheck.png')}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: "#FFF",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    shadow: {
        //Its for IOS
        shadowColor: 'rgba(0, 0, 0, 0.16)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        // its for android
        elevation: 5,
        position: 'relative',
        backgroundColor: '#FFF',
    },
    header: {
        //Its for IOS
        shadowColor: 'rgba(0, 0, 0, 0.16)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        // its for android
        elevation: 5,
        position: 'relative',
        flexDirection: 'row',
        backgroundColor: '#FFF',
        height: 48,
    },
    scene: {
        height: Dimensions.get('window').height
    },
});