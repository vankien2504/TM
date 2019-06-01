import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
const GLOBAL = require('../../share/global.js');
class Config extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    ChangePage(page, params) {
        this.props.navigation.navigate(page, {
            params,
            onGoBack: (task) => this.refresh(task),
        });
    }
    refresh(task) {

        this.props.navigation.state;
        // AsyncStorage.getItem('task').then((res, error) => {
        //     if (res) {
        //         let taskWaitingObject = JSON.parse(res)
        //         this.setState({
        //             taskWaiting: taskWaitingObject[0].ListTask.Data,
        //             taskWaitingStand: taskWaitingObject[0].ListTask.Data
        //         });
        //     } else {
        //         this.TaskList();
        //     }
        // });

    }
    Logout() {

        let keys = ['tokenObject', 'userInfo', 'taskConfig', 'task', 'lstTrangThai', 'lstDoUuTien', 'filterTask', 'filterDashboard', 'sortTask',
            'DanhSachBoPhan', 'DanhSachBoPhanKhongThuocCoCau', 'DanhSachNhanSu', 'DanhSachNhanSuKhongTheoCoCau',
            'notVisibleNotify'
        ];
        AsyncStorage.multiRemove(keys, (err) => {
            this.props.navigation.navigate('LoginScreen', { tabPositions: 0 });
        });

        // AsyncStorage.removeItem('tokenObject').then((res, error) => {

        // });
    }
    render() {
        return (
            <View>
                <View style={{ height: 62, flexDirection: 'row' }} >
                    <TouchableOpacity onPress={() => this.setState({})}>
                        <Image
                            style={{ marginTop: 21, marginLeft: 16, marginRight: 16, height: 21, width: 21 }}
                            source={require('../../assets/icons/Setting.png')}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 62 }}>
                        Cấu hình
                        </Text>

                </View>
                <View style={styles.shadow}>


                    <View style={{ height: 106, flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#C3C3C3' }} >
                        <TouchableOpacity onPress={() => this.setState({})}>
                            <Image
                                style={{ marginTop: 21, marginLeft: 16, marginRight: 16, height: 68, width: 68, borderRadius: 68 }}
                                source={require('../../assets/imgs/avatar.png')}
                            />
                        </TouchableOpacity>
                        <View style={{ flex: 1, marginTop: 22 }}>
                            <Text numberOfLines={1} style={{ fontSize: 15, fontWeight: 'bold', }}>
                                {GLOBAL.userInfo.UserName}
                            </Text>
                            <Text numberOfLines={1} style={{ fontSize: 15, }}>
                                {GLOBAL.userInfo.Roles}
                            </Text>
                            <Text numberOfLines={1} style={{ fontSize: 15, color: '#C3C3C3', }}>
                                Đang trực tuyến
                        </Text>
                        </View>
                        <View>
                            <TouchableOpacity>
                                <Text numberOfLines={2} style={{ marginRight: 16, marginTop: 34, fontSize: 15, color: '#3498DB', width: 62 }}>
                                    Thay đổi
                thông tin
                        </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <TouchableOpacity onPress={() => this.Logout()}>
                        <View style={{ height: 56, flexDirection: 'row', backgroundColor: '#FFF' }} >
                            <Image
                                style={{ marginTop: 13, marginLeft: 36, marginRight: 40, height: 26, width: 26, borderRadius: 68 }}
                                source={require('../../assets/icons/quit.png')}
                            />
                            <Text style={{ marginTop: 18, fontSize: 15, color: '#FF0000', }}>
                                Đăng xuất
                        </Text>

                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.shadow, { marginTop: 16 }]}>
                    <TouchableOpacity onPress={() => this.setState({})}>
                        <View style={{ height: 56, flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#C3C3C3' }} >
                            <Image
                                style={{ marginTop: 13, marginLeft: 36, marginRight: 40, height: 26, width: 26, borderRadius: 68 }}
                                source={require('../../assets/icons/Setting.png')}
                            />
                            <Text style={{ marginTop: 18, fontSize: 15, flex: 1 }}>
                                Cấu hình
                        </Text>
                            <Image
                                style={{ marginTop: 18, marginLeft: 16, marginRight: 15, width: 9, height: 16 }}
                                source={require('../../assets/icons/Arrow_right.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.ChangePage('NotifyScreen', 'a')}>
                        <View style={{ height: 56, flexDirection: 'row', backgroundColor: '#FFF' }} >
                            <Image
                                style={{ marginTop: 13, marginLeft: 36, marginRight: 40, height: 26, width: 23 }}
                                source={require('../../assets/icons/noti.png')}
                            />
                            <Text style={{ marginTop: 18, fontSize: 15, flex: 1 }}>
                                Thông báo
                        </Text>
                            <Image
                                style={{ marginTop: 18, marginLeft: 16, marginRight: 15, width: 9, height: 16 }}
                                source={require('../../assets/icons/Arrow_right.png')}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 62, flexDirection: 'row' }} >
                    <TouchableOpacity onPress={() => this.setState({})}>
                        <Image
                            style={{ marginTop: 21, marginLeft: 16, marginRight: 16, height: 21, width: 21 }}
                            source={require('../../assets/icons/transfer.png')}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 62 }}>
                        Chuyển đổi ứng dụng
                        </Text>

                </View>
                <View style={[styles.shadow]}>
                    <TouchableOpacity onPress={() => this.setState({})}>
                        <View style={{ height: 50, flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#C3C3C3' }} >
                            <Image
                                style={{ marginTop: 14, marginLeft: 16, marginRight: 40, height: 23, width: 104 }}
                                source={require('../../assets/imgs/digitaskBlue.png')}
                            />
                            <Text style={{ lineHeight: 50, fontSize: 19, flex: 1 }}>
                                Quản lý ứng dụng
                        </Text>
                            <Image
                                style={{ marginTop: 18, marginLeft: 16, marginRight: 15, width: 20, height: 20 }}
                                source={require('../../assets/icons/radioCheckActive.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({})}>
                        <View style={{ height: 50, flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#C3C3C3' }} >
                            <Image
                                style={{ marginTop: 14, marginLeft: 16, marginRight: 40, height: 23, width: 104 }}
                                source={require('../../assets/imgs/digiiCAT.png')}
                            />
                            <Text style={{ lineHeight: 50, fontSize: 19, flex: 1 }}>
                                Quản lý ứng dụng
                        </Text>
                            <Image
                                style={{ marginTop: 18, marginLeft: 16, marginRight: 15, width: 20, height: 20 }}
                                source={require('../../assets/icons/radioCheck.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({})}>
                        <View style={{ height: 50, flexDirection: 'row', backgroundColor: '#FFF' }} >
                            <Image
                                style={{ marginTop: 14, marginLeft: 16, marginRight: 40, height: 23, width: 104 }}
                                source={require('../../assets/imgs/digiiKPI.png')}
                            />
                            <Text style={{ lineHeight: 50, fontSize: 19, flex: 1 }}>
                                Quản lý ứng dụng
                        </Text>
                            <Image
                                style={{ marginTop: 18, marginLeft: 16, marginRight: 15, width: 20, height: 20 }}
                                source={require('../../assets/icons/radioCheck.png')}
                            />
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
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
})
export default Config;

