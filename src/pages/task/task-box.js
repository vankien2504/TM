import React, { Component } from "react";
import { AsyncStorage, View, Dimensions, TouchableHighlight, style, TextInput, Text, Button, Image, Alert, StyleSheet, TouchableOpacity } from "react-native";
import Moment from 'moment';
import { hasValue, ChangePage } from '../../share/services/ultility';
import TaskService from "../../share/services/task.service";
import Modal from "react-native-modal";
import { ConfirmDialog } from 'react-native-simple-dialogs';
import CheckboxModest from 'react-native-modest-checkbox'
const { height } = Dimensions.get('window')
const GLOBAL = require('../../share/global.js');
import CustomIcon from '../../share/customize/iconCustomize/CustomIcon.js';
export default class TaskBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            taskWaiting: this.props.taskWaiting,
            visibleModal: false,
            visibleModalGiaoViec: false,
            dialogVisible: false,
            UuTien: {},
            TrangThai: {}
        }
        console.log('component task waiting loaded');
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.taskWaiting != nextProps.taskWaiting) {
            this.setState({ taskWaiting: nextProps.taskWaiting });
        }
    }

    componentWillMount() {
        GLOBAL.lstDoUuTien.forEach(element => {
            if (this.state.taskWaiting.IDUuTien == element.ID) {
                this.state.UuTien = element
            }
        });
        GLOBAL.lstTrangThai.forEach(element => {
            if (this.state.taskWaiting.IDTrangThai == element.ID) {
                this.state.TrangThai = element
            }
        });
    }

    EditGhim() {
        this.state.taskWaiting.Ghim = !this.state.taskWaiting.Ghim;
        let params = { EditField: 'Ghim', EditItem: this.state.taskWaiting };
        this.setState({
            taskWaiting: this.state.taskWaiting
        });
        TaskService.EditData(params).then((res) => {
            let taskWaitingObject = JSON.parse(res)
            this.setState({
                taskWaiting: taskWaitingObject.Data[0]
            });
        });
    }
    NotVisibleNotify() {
        this.setState({ NotVisibleNotify: true });
        try {
            AsyncStorage.setItem('notVisibleNotify', JSON.stringify(true));
        } catch (error) {
            console.log("Error saving data" + error);
        }
    }
    EditGiaoCongViec() {
        if (this.checkGiaoViec(this.state.taskWaiting)) {
            this.state.taskWaiting.GiaoCongViec = true;
            let params = { EditField: 'GiaoCongViec', EditItem: this.state.taskWaiting };
            // thông báo giao việc
            AsyncStorage.getItem('notVisibleNotify').then((res, error) => {
                if (res) {
                } else {
                    this.setState({
                        visibleModalGiaoViec: true,
                    });
                }
            });

            TaskService.EditData(params).then((res) => {
                let taskWaitingObject = JSON.parse(res);
                AsyncStorage.getItem('task').then((res, error) => {
                    if (res) {
                        let taskFollowingObject = JSON.parse(res);
                        for (i = 0; i < taskFollowingObject[0].ListTask.Data.length; i++) {
                            if (taskFollowingObject[0].ListTask.Data[i].ID == taskWaitingObject.Data[0].ID) {
                                taskFollowingObject[0].ListTask.Data.splice(i, 1);
                            }
                        }
                        taskFollowingObject[1].ListTask.Data.unshift(taskWaitingObject.Data[0]);

                        try {
                            AsyncStorage.setItem('task', JSON.stringify(taskFollowingObject));
                            AsyncStorage.setItem('taskConfig', JSON.stringify(taskConfig));

                        } catch (error) {
                            console.log("Error saving data" + error);
                        }

                        // chỗ này để nó không bị tắt popup khi chưa bấm nút không hiển thị nữa
                        AsyncStorage.getItem('notVisibleNotify').then((res, error) => {
                            if (res) {
                                this.setState({ taskWaiting: null });
                            } else {

                            }
                        });
                        this.props.callbackFromParent({ Attribute: "ChangeData", Tab: 1, CheckTab: 1 });

                    } else {

                    }
                });

                // this.TaskList();
            });
        } else {
            this.setState({
                visibleModal: true
            });
        }
    }
    TaskList() {
        let today = new Date();
        let date2 = new Date(new Date().setDate(today.getDate() - 30));
        let dateStart = Moment(date2).format('YYYY-MM-DDT00-00-01');
        let dateEnd = Moment(today).format('YYYY-MM-DDT23-59-59');
        let param = {
            "request": [
                { "Page": 1, "PageSize": 50, "GroupType": 1, "Filter": "(IDTrangThai~neq~8~and~IDTrangThai~neq~4~and~IDTrangThai~neq~3~and~IDTrangThai~neq~10~and~IDTrangThai~neq~9)", "Sort": "LevelCode-asc" },
                { "Page": 1, "PageSize": 50, "GroupType": 2, "Filter": "(Today~eq~true~or~Trehan~eq~true)~and~(IDTrangThai~neq~8~and~IDTrangThai~neq~4~and~IDTrangThai~neq~3~and~IDTrangThai~neq~10~and~IDTrangThai~neq~9)~and~IDNhanSuThucHienChinh~eq~" + GLOBAL.userInfo.IDNhanSu, "Sort": "LevelCode-asc" },
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
    DeleteTaskConfirm() {
        this.setState({
            dialogVisible: true
        })
    }
    DeleteTask() {
        this.state.taskWaiting.IsDeleted = true;
        let params = { EditField: 'IsDeleted', EditItem: this.state.taskWaiting }
        this.setState({ visibleModal: false, taskWaiting: null })

        TaskService.DeleteData(params).then((res) => {
            let taskWaitingObject = JSON.parse(res)
            // this.setState({
            //     taskWaiting: null
            // });
        });
    }
    checkGiaoViec(item) {
        let that = this;
        let result = false;
        if (item.Type == 1 && !item.GiaoCongViec && hasValue(item.IDNhanSuThucHienChinh) && hasValue(item.KetThucEst)) {
            result = true;
        }
        return result;
    }
    refresh(task) {
        this.props.navigation.state;
        this.props.callbackFromParent({ Attribute: "ChangeData" });
        GLOBAL.lstDoUuTien.forEach(element => {
            if (this.state.taskWaiting.IDUuTien == element.ID) {
                this.state.UuTien = element
            }
        });
        this.setState({
            taskWaiting: task,
            UuTien: this.state.UuTien
        });

    }
    ChangePage(page, params) {
        this.setState({
            visibleModal: false
        });
        this.props.navigation.navigate(page, {
            params,
            onGoBack: (task) => this.refresh(task),
        });
    }
    ChangePageTaskTheodoi() {
        this.setState({
            visibleModalGiaoViec: false,
            taskWaiting: null
        });
        let taskConfig = {
            index: 1,
            TaskFollowingTab: 0,
            TaskApprovingTab: 0,
        }
        try {
            AsyncStorage.setItem('taskConfig', JSON.stringify(taskConfig));
            this.props.callbackFromParent({ Attribute: "ChangeApprovingTab", Tab: 2, CheckTab: 1 });
        } catch (error) {
            console.log("Error saving data" + error);
        }

        this.props.callbackFromParent({ Attribute: "ChangeFollowingTab", Tab: 1, CheckTab: 1 });
    }
    renderModalContent = () => (
        <View style={styles.modalContent}>
            <View style={{ flexDirection: "row" }}>
                <Image
                    style={{ marginLeft: 0, marginRight: 15, height: 24, width: 24 }}
                    source={require('../../assets/icons/danger.png')}
                />
                <Text style={{ fontFamily: 'Muli', fontWeight: 'bold', color: '#ff0000', fontSize: 15 }}>Thiếu thông tin giao việc</Text>
            </View>
            <Text style={{ marginTop: 20, fontFamily: 'Muli', color: '#5d5d5d', fontSize: 13 }}>
                Giao việc cần có ít nhất thông tin người thực hiện và thời hạn.</Text>
            <TouchableOpacity onPress={() => this.ChangePage('TaskEditScreen', this.state.taskWaiting)}>
                <View style={styles.ButtonInBox1}>
                    <Text style={{ flex: 1, height: 40, lineHeight: 40, fontSize: 15, marginLeft: 20, fontFamily: 'Muli', fontWeight: 'bold', marginHorizontal: 13 }}>
                        Thêm người thực hiện
                        </Text>

                    <Image
                        style={{ marginRight: 20, height: 16, width: 9 }}
                        source={require('../../assets/icons/Arrow_right.png')}
                    />

                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.ChangePage('TaskEditScreen', this.state.taskWaiting)}>
                <View style={styles.ButtonInBox2}>
                    <Text style={{ flex: 1, height: 40, lineHeight: 40, fontSize: 15, marginLeft: 20, fontFamily: 'Muli', fontWeight: 'bold', marginHorizontal: 13 }}>
                        Thêm thời hạn
                        </Text>
                    <Image
                        style={{ marginRight: 20, height: 16, width: 9 }}
                        source={require('../../assets/icons/Arrow_right.png')}
                    />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ visibleModal: false })}>
                <Image
                    style={{ alignSelf: 'center', marginTop: 37, marginBottom: 22, marginRight: 20, height: 22, width: 74 }}
                    source={require('../../assets/icons/dong.png')}
                />
            </TouchableOpacity>

        </View>
    );
    renderModalGiaoViec = () => (
        <View style={styles.modalContent}>
            <View style={{ flexDirection: "row", alignSelf: 'center' }}>
                <Image
                    style={{ marginLeft: 0, marginRight: 15, height: 24, width: 24 }}
                    source={require('../../assets/icons/success.png')}
                />
                <Text style={{ fontFamily: 'Muli', fontWeight: 'bold', color: '#5CB800', fontSize: 15 }}>Đã giao việc</Text>
            </View>
            <Text style={{ marginTop: 20, fontFamily: 'Muli', color: '#5d5d5d', fontSize: 15 }}>
                Công việc đã được giao và nằm trong mục <Text style={{ color: '#F1802E' }}> Theo dõi</Text></Text>
            <TouchableOpacity onPress={() => this.ChangePageTaskTheodoi()}>
                <View style={styles.ButtonInBox1}>
                    <Text style={{ flex: 1, height: 40, lineHeight: 40, fontSize: 15, marginLeft: 20, fontFamily: 'Muli', fontWeight: 'bold', marginHorizontal: 13 }}>
                        Đến mục <Text style={{ color: '#F1802E' }}> Theo dõi</Text>
                    </Text>

                    <Image
                        style={{ marginRight: 20, height: 16, width: 9 }}
                        source={require('../../assets/icons/Arrow_right.png')}
                    />

                </View>
            </TouchableOpacity>
            <View style={{ marginTop: 30 }}>
                <CheckboxModest
                    checked={this.state.NotVisibleNotify}
                    label='Không hiện lại thông báo này'

                    labelStyle={{ fontSize: 15, color: '#5d5d5d' }}
                    checkedComponent={<Image
                        labelStyle={{ fontSize: 15 }}
                        style={{ height: 14, width: 14 }}
                        source={require('../../assets/icons/check.png')} />}
                    uncheckedComponent={<Image
                        style={{ height: 14, width: 14, marginTop: 2 }}
                        source={require('../../assets/icons/uncheck.png')} />}
                    onChange={() => { this.NotVisibleNotify() }}
                />
            </View>
            <TouchableOpacity onPress={() => this.setState({ visibleModal: false, taskWaiting: null })}>
                <Image
                    style={{ alignSelf: 'center', marginTop: 37, marginBottom: 22, marginRight: 20, height: 22, width: 74 }}
                    source={require('../../assets/icons/dong.png')}
                />
            </TouchableOpacity>

        </View>
    );
    render() {
        const { wrapper } = styles;
        if (this.state.taskWaiting) {
            return (
                <View style={wrapper} >
                    <ConfirmDialog
                        title="Bạn chắc chắn muốn xóa?"
                        visible={this.state.dialogVisible}
                        onTouchOutside={() => this.setState({ dialogVisible: false })}
                        positiveButton={{
                            title: "Xóa",
                            onPress: () => this.DeleteTask()
                        }}
                        negativeButton={{
                            title: "Hủy",
                            onPress: () => this.setState({ dialogVisible: false })
                        }} >
                        <View>

                        </View>
                    </ConfirmDialog>
                    <Modal
                        isVisible={this.state.visibleModal}
                        onBackdropPress={() => this.setState({ visibleModal: false })}
                        animationIn="slideInLeft"
                        animationOut="slideOutRight">
                        {this.renderModalContent()}
                    </Modal>
                    <Modal
                        isVisible={this.state.visibleModalGiaoViec}
                        onBackdropPress={() => this.setState({ visibleModalGiaoViec: false })}
                        animationIn="slideInLeft"
                        animationOut="slideOutRight">
                        {this.renderModalGiaoViec()}
                    </Modal>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 40, borderLeftWidth: 3, borderTopStartRadius: 3, borderTopEndRadius: 3, borderLeftColor: this.state.TrangThai.Color, borderBottomWidth: 1, borderBottomColor: '#c3c3c3' }}>
                        <Text style={{ flex: 1, height: 40, lineHeight: 40, fontSize: 13, fontFamily: 'Muli', fontWeight: 'bold', marginHorizontal: 13 }}>
                            {this.state.taskWaiting.MoTaCongViec}
                        </Text>
                        <TouchableOpacity onPress={() => this.EditGhim()}>
                            <Image
                                style={{ height: 18, width: 18 }}
                                source={(this.state.taskWaiting.Ghim) ? require('../../assets/icons/pinActive.png') : require('../../assets/icons/pin.png')}
                                key={this.state.taskWaiting.Ghim}

                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.ChangePage('TaskEditScreen', this.state.taskWaiting)}>
                            <Image
                                style={{ marginRight: 15, height: 16, width: 9, marginLeft: 30 }}
                                source={require('../../assets/icons/Arrow_right.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', height: 35, borderBottomWidth: 1, marginLeft: 15, borderBottomColor: '#c3c3c3' }}>
                        <Text style={{ height: 40, lineHeight: 40, color: '#999999', fontSize: 13 }}>
                            Giao cho
                            </Text>
                        <Text style={{ flex: 1, height: 35, lineHeight: 35, marginLeft: 35, color: '#5D5D5D', fontSize: 13 }}>
                            {this.state.taskWaiting.TenNhanSuThucHienChinh ? this.state.taskWaiting.TenNhanSuThucHienChinh : 'chưa có'}
                        </Text>
                        <TouchableOpacity onPress={() => this.ChangePage('TaskEditScreen', this.state.taskWaiting)} style={{ marginRight: 15 }}>
                            <Text style={{ height: 35, lineHeight: 35, flex: 1, color: "#0092ff" }}>
                                thay đổi
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', height: 35, borderBottomWidth: 1, marginLeft: 15, borderBottomColor: '#c3c3c3' }}>
                        <Text style={{ height: 35, lineHeight: 35, color: '#999999', fontSize: 13 }}>
                            Thời hạn
                            </Text>
                        <Text style={{ flex: 1, height: 35, lineHeight: 35, marginLeft: 35, color: '#5D5D5D', fontSize: 13 }}>
                            {/* 19/09/2018 - 18:00 */}
                            {/* {this.state.taskWaiting.KetThucEst} */}
                            {this.state.taskWaiting.KetThucEst ? Moment(this.state.taskWaiting.KetThucEst).format('DD/MM/YYYY - HH:mm') : 'chưa có'}
                        </Text>
                        <TouchableOpacity onPress={() => this.ChangePage('TaskEditScreen', this.state.taskWaiting)} style={{ marginRight: 15 }}>
                            <Text style={{ height: 35, lineHeight: 35, flex: 1, color: "#0092ff" }}>
                                thay đổi
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', height: 35, marginLeft: 15, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ width: 52, height: 35, lineHeight: 35, color: '#999999', fontSize: 13 }}>
                            Ưu tiên
                            </Text>
                        <Text style={{ flex: 1, height: 35, lineHeight: 35, marginLeft: 35, color: '#5D5D5D', fontSize: 13 }}>
                            {this.state.UuTien ? this.state.UuTien.Name : 'chưa có'}
                        </Text>
                        <TouchableOpacity onPress={() => this.ChangePage('TaskEditScreen', this.state.taskWaiting)} style={{ marginRight: 15 }}>
                            <CustomIcon name='flag' size={16} style={[{ marginTop: 6, marginRight: 15, justifyContent: 'center' }, this.state.UuTien.Color ? { color: this.state.UuTien.Color } : {}]} />
                        </TouchableOpacity>
                        {/* <Image
                            style={{ marginRight: 15, height: 16, width: 13 }}
                            source={require('../../assets/icons/flag-yellow.png')}
                            onPress={this.changeLogo}
                        /> */}
                    </View>
                    <View style={{ height: 32, backgroundColor: '#f6f6f6', flexDirection: 'row' }}>
                        <Text style={{ flex: 1 }}></Text>
                        <TouchableOpacity onPress={() => this.DeleteTaskConfirm()} style={{ marginRight: 30 }}>
                            <Text style={{ height: 32, lineHeight: 32, color: "#5d5d5d", alignItems: 'flex-end' }}>
                                Xóa
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.EditGiaoCongViec()} style={{ marginRight: 15 }}>
                            <Text style={[(this.checkGiaoViec(this.state.taskWaiting)) ? styles.giaoviecActive : styles.giaoviec]} >
                                Giao việc
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return (
                <View></View>
            )
        }

    }
}
const styles = StyleSheet.create({
    giaoviec: {
        height: 32, lineHeight: 32, color: "#5d5d5d", alignSelf: 'flex-end'
    },
    giaoviecActive: {
        height: 32, lineHeight: 32, color: "#5cb800", fontWeight: 'bold', alignSelf: 'flex-end'
    },
    modalContent: {
        backgroundColor: "#FFF",
        paddingLeft: 26,
        paddingRight: 26,
        paddingTop: 20,
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    wrapper: {
        height: 175,
        backgroundColor: '#FFF',
        borderRadius: 3,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: 'red',
        shadowOpacity: 1,
        elevation: 3,
        zIndex: 999,
    },
    ButtonInBox1: {
        //Its for IOS
        shadowColor: 'rgba(0, 0, 0, 0.16)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        // its for android
        elevation: 5,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 40,
        borderRadius: 3,
        backgroundColor: '#f6f6f6',
        marginTop: 20
    },
    ButtonInBox2: {
        //Its for IOS
        shadowColor: 'rgba(0, 0, 0, 0.16)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        // its for android
        elevation: 5,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 40, borderRadius: 3,
        backgroundColor: '#f6f6f6',
        marginTop: 10
    }
});