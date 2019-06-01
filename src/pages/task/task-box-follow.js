import React, { Component } from "react";
import { AsyncStorage, View, Dimensions, style, TextInput, Text, Button, Image, Alert, StyleSheet, TouchableOpacity } from "react-native";
import Checkbox from 'react-native-custom-checkbox';
import moment from 'moment';
import Modal from "react-native-modal";
import CheckboxModest from 'react-native-modest-checkbox'
import TaskService from "../../share/services/task.service";
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import * as Progress from '../../share/customize/react-native-progress';
const GLOBAL = require('../../share/global.js');
const { height } = Dimensions.get('window')
export default class TaskBoxFollow extends React.PureComponent {
    constructor(props) {
        super(props);
        let today = new Date();
        this.state = {
            name: "",
            taskFollowing: this.props.taskFollowing,
            visibleModalHoanTat: false,
            visibleModalHoanTat2: false,
            dialogVisible: false,
            collapse: this.props.collapse,
            UuTien: {},
            TrangThai: {},
            today: today
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.collapse != nextProps.collapse) {
            this.setState({ collapse: nextProps.collapse });
        }
        if (this.props.taskFollowing != nextProps.taskFollowing) {
            GLOBAL.lstTrangThai.forEach(element => {
                if (nextProps.taskFollowing.IDTrangThai == element.ID) {
                    this.state.TrangThai = element
                }
            });
            this.setState({ taskFollowing: nextProps.taskFollowing, TrangThai: this.state.TrangThai });
        }
        // console.log('====collapse', this.state.collapse)
        // console.log('====nextProps', nextProps.collapse)
    }
    componentWillMount() {
        GLOBAL.lstDoUuTien.forEach(element => {
            if (this.state.taskFollowing.IDUuTien == element.ID) {
                this.state.UuTien = element
            }
        });
        GLOBAL.lstTrangThai.forEach(element => {
            if (this.state.taskFollowing.IDTrangThai == element.ID) {
                this.state.TrangThai = element
            }
        });
    }
    EditPercent() {
        this.state.taskFollowing.MucDoHoanThanh = this.state.taskFollowing.MucDoHoanThanh + 25;
        if (this.state.taskFollowing.MucDoHoanThanh > 100) {
            this.state.taskFollowing.MucDoHoanThanh = 0;
        }

        let params = { EditField: 'MucDoHoanThanh', EditItem: this.state.taskFollowing }
        TaskService.EditData(params).then((res) => {
            let taskFollowingObject = JSON.parse(res);
            if (taskFollowingObject.Data[0].MucDoHoanThanh < 100) {
                GLOBAL.lstTrangThai.forEach(element => {
                    if (element.ID == GLOBAL.defaultTrangThai.DangThucHien) {
                        this.state.TrangThai = element
                    }
                });

            }

            // this.props.callbackFromParent({ Attribute: "ChangeData" });
            // để cái này bên trên cho nó chạy nhanh hơn
            this.setState({
                taskFollowing: taskFollowingObject.Data[0],
                TrangThai: this.state.TrangThai,
            });
        });
        // this.setState({
        //     taskFollowing: this.state.taskFollowing
        // });
        this.setState({ TrangThai: this.state.TrangThai, taskFollowing: { ...this.state.taskFollowing, MucDoHoanThanh: this.state.taskFollowing.MucDoHoanThanh } });
        // if (this.state.taskFollowing.MucDoHoanThanh < 100) {
        //     GLOBAL.lstTrangThai.forEach(element => {
        //         if (element.ID == GLOBAL.defaultTrangThai.DangThucHien) {
        //             this.state.TrangThai = element
        //         }
        //     });

        // }
    }
    EditGuiHoanTat() {
        this.state.taskFollowing.IDTrangThai = GLOBAL.defaultTrangThai.HoanTat;
        this.state.taskFollowing.MucDoHoanThanh = 100;
        let params = { EditField: 'IDTrangThai', EditItem: this.state.taskFollowing }
        TaskService.EditData(params).then((res) => {
            let taskApprovingObject = JSON.parse(res)
            AsyncStorage.getItem('task').then((res, error) => {
                if (res) {
                    let taskFollowingObject = JSON.parse(res);
                    for (i = 0; i < taskFollowingObject[1].ListTask.Data.length; i++) {
                        if (taskFollowingObject[1].ListTask.Data[i].ID == taskApprovingObject.Data[0].ID) {
                            taskFollowingObject[1].ListTask.Data.splice(i, 1);
                        }
                    }
                    taskFollowingObject[5].ListTask.Data.unshift(taskApprovingObject.Data[0]);
                    try {
                        AsyncStorage.setItem('task', JSON.stringify(taskFollowingObject));
                    } catch (error) {
                        console.log("Error saving data" + error);
                    }
                } else {

                }
            });
            this.setState({
                taskFollowing: taskFollowingObject.Data[0]
            });
        });
    }
    EditGuiDuyet() {
        this.state.taskFollowing.GuiHoanTat = true;
        this.state.taskFollowing.MucDoHoanThanh = 100;
        AsyncStorage.getItem('task').then((res, error) => {
            if (res) {
                let taskFollowingObject = JSON.parse(res);
                for (i = 0; i < taskFollowingObject[1].ListTask.Data.length; i++) {
                    if (taskFollowingObject[1].ListTask.Data[i].ID == this.state.taskFollowing.ID) {
                        taskFollowingObject[1].ListTask.Data.splice(i, 1);
                    }
                }
                taskFollowingObject[2].ListTask.Data.unshift(this.state.taskFollowing);
                try {
                    AsyncStorage.setItem('task', JSON.stringify(taskFollowingObject));
                } catch (error) {
                    console.log("Error saving data" + error);
                }
            } else {

            }
        });
        let params = { EditField: 'GuiHoanTat', EditItem: this.state.taskFollowing }
        TaskService.EditData(params).then((res) => {
            let taskApprovingObject = JSON.parse(res);
            this.setState({
                taskFollowing: taskFollowingObject.Data[0]
            });
        });
    }
    checkHoanTat(item) {
        let that = this;
        let result = false;
        let lstTrangThai = [GLOBAL.defaultTrangThai.MoiMo, GLOBAL.defaultTrangThai.DangThucHien,
        GLOBAL.defaultTrangThai.MoLai];
        if (!item.DaKhoa) {
            if (lstTrangThai.indexOf(item.IDTrangThai) > -1) {
                if ((item.IDNhanSuTao == item.IDNhanSuThucHienChinh)) {
                    result = true;
                } else {
                    if (!item.IsOwner && item.GiaoCongViec && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
                        result = true;
                    }
                }
            }

        }
        return result;
    }
    GuiDuyetTaskConfirm() {
        if (this.state.taskFollowing.IDNhanSuTao != GLOBAL.userInfo.IDNhanSu) {
            this.setState({
                visibleModalHoanTat2: true
            })
        } else {
            this.EditGuiHoanTat();
            this.setState({
                visibleModalHoanTat: true
            })
        }

    }
    EditGhim() {
        this.state.taskFollowing.Ghim = !this.state.taskFollowing.Ghim;
        let params = { EditField: 'Ghim', EditItem: this.state.taskFollowing };
        this.setState({
            taskFollowing: this.state.taskFollowing
        });
        TaskService.EditData(params).then((res) => {
            let taskFollowingObject = JSON.parse(res)
            this.setState({
                taskFollowing: taskFollowingObject.Data[0]
            });
        });
    }

    refresh(task) {
        this.props.navigation.state;
        this.state.taskFollowing = task;
        GLOBAL.lstTrangThai.forEach(element => {
            if (task.IDTrangThai == element.ID) {
                this.state.TrangThai = element
            }
        });
        this.setState({
            taskFollowing: task,
            TrangThai: this.state.TrangThai

        });
        this.props.callbackFromParent({ Attribute: "ChangeData" });

    }
    ChangePage(page, params) {
        this.setState({
            visibleModal: false
        });
        this.props.navigation.push(page, {
            routeName: page,
            params,
            onGoBack: (task) => this.refresh(task),
        }
        );
    }
    _renderView = (collapse) => {
        return (
            <View style={styles.wrapper} >
                <ConfirmDialog
                    title="Bạn chắc chắn muốn xóa?"
                    visible={this.state.dialogVisible}
                    onTouchOutside={() => this.setState({ dialogVisible: false })}
                    positiveButton={{
                        title: "Xóa",
                        onPress: () => this.EditGuiHoanTat()
                    }}
                    negativeButton={{
                        title: "Hủy",
                        onPress: () => this.setState({ dialogVisible: false })
                    }} >
                    <View>

                    </View>
                </ConfirmDialog>

                <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 40, borderLeftWidth: 3, borderTopStartRadius: 3, borderTopEndRadius: 3, borderLeftColor: this.state.TrangThai.Color, borderBottomWidth: 1, borderBottomColor: '#c3c3c3' }}>
                    <Text style={{ flex: 1, height: 40, lineHeight: 40, fontSize: 13, fontWeight: 'bold', marginHorizontal: 13, fontFamily: "Muli" }}>
                        {this.state.taskFollowing.MoTaCongViec}
                    </Text>

                    <TouchableOpacity onPress={() => this.EditGhim()}>
                        <Image
                            style={{ marginRight: 30, height: 18, width: 18 }}
                            source={(this.state.taskFollowing.Ghim) ? require('../../assets/icons/pinActive.png') : require('../../assets/icons/pin.png')}
                            key={this.state.taskFollowing.Ghim}

                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.ChangePage('TaskEditScreen', this.state.taskFollowing)}>
                        <Image
                            style={{ marginRight: 15, height: 16, width: 9 }}
                            source={require('../../assets/icons/Arrow_right.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    _renderCollapseView = (collapse) => {
        return (
            <View style={styles.collapseView}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 40, backgroundColor: '#f6f6f6', flexDirection: 'row', width: 47, }}>
                    <TouchableOpacity onPress={this._onPressButton} style={{ marginRight: 25, height: 40 }}>
                        <Text style={{ fontSize: 13, width: 47, color: "#5d5d5d", alignSelf: 'flex-end', }}>
                            {this.state.taskFollowing.MaNhanSuThucHienChinh}
                        </Text>
                        <Text style={{ fontSize: 13, width: 47, color: "#5d5d5d", alignSelf: 'flex-end', }}>
                            {this.state.taskFollowing.TenNganNhanSuThucHienChinh}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onPressButton} style={{ marginRight: 15, height: 40, width: 58 }}>
                        <Text style={[{ fontSize: 13, width: 56, alignSelf: 'flex-end', }, moment(this.state.taskFollowing.KetThucEst).format('YYYY-MM-DD') < moment(this.state.today).format('YYYY-MM-DD') ? { color: "#5d5d5d" } : { color: "red" }]}>
                            {this.state.taskFollowing.KetThucEst ? moment(this.state.taskFollowing.KetThucEst).format('HH:mm') : 'chưa có'}
                        </Text>
                        <Text style={[{ fontSize: 13, width: 58, alignSelf: 'flex-end', }, moment(this.state.taskFollowing.KetThucEst).format('YYYY-MM-DD') < moment(this.state.today).format('YYYY-MM-DD') ? { color: "#5d5d5d" } : { color: "red" }]}>
                            {this.state.taskFollowing.KetThucEst ? moment(this.state.taskFollowing.KetThucEst).format('DD/MM/YY') : ''}
                        </Text>
                    </TouchableOpacity>
                    <View style={{ marginRight: 35 }}>
                        <TouchableOpacity onPress={() => this.EditPercent()} >
                            <Progress.Circle textStyle={{ fontSize: 12 }} showsText={true} color={(this.state.taskFollowing.MucDoHoanThanh === 100) ? '#5cb800' : '#5a6276'} progress={this.state.taskFollowing.MucDoHoanThanh / 100} size={30} thickness={(this.state.taskFollowing.MucDoHoanThanh === 100) ? 1 : 2} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginRight: 10 }}>
                        <View style={this.state.taskFollowing.MucDoHoanThanh == 100 ? { display: 'none', visibility: 'hidden', opacity: 0 } : {}}>
                            <Checkbox
                                checked={this.state.taskFollowing.MucDoHoanThanh == 100}
                                style={{ backgroundColor: 'transparent', borderColor: '#707070', color: '#707070', borderRadius: 50, marginTop: 0 }}
                                onChange={() => this.GuiDuyetTaskConfirm()} />
                        </View>

                        <View style={this.state.taskFollowing.MucDoHoanThanh == 100 ? {} : { display: 'none', visibility: 'hidden', opacity: 0 }}>
                            <Checkbox
                                checked={this.state.taskFollowing.MucDoHoanThanh == 100}
                                style={{ backgroundColor: 'transparent', borderColor: '#5cb800', color: '#5cb800', borderRadius: 50, marginTop: 0 }}
                                onChange={() => this.GuiDuyetTaskConfirm()} />
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => this.GuiDuyetTaskConfirm()} style={{ marginRight: 15 }}>
                        <Text style={[(this.state.taskFollowing.MucDoHoanThanh === 100) ? styles.hoantatActive : styles.hoantat]}>
                            Hoàn tất
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
    renderModalHoanTat = () => (
        <View style={styles.modalContent}>
            <View style={{ flexDirection: "row", alignSelf: 'center' }}>
                <Image
                    style={{ marginLeft: 0, marginRight: 15, height: 24, width: 24 }}
                    source={require('../../assets/icons/success.png')}
                />
                <Text style={{ fontFamily: 'Muli', fontWeight: 'bold', color: '#5CB800', fontSize: 15 }}>Hoàn tất công việc</Text>
            </View>
            <Text style={{ marginTop: 20, fontFamily: 'Muli', color: '#5d5d5d', fontSize: 15 }}>
                Công việc bạn chịu trách nhiệm đã hoàn tất và được chuyển đến danh sách <Text style={{ color: '#F1802E', fontSize: 15 }}> Kết thúc</Text>. </Text>
            <TouchableOpacity onPress={() => this.ChangePageTaskKetThuc()}>
                <View style={styles.ButtonInBox1}>
                    <Text style={{ flex: 1, height: 40, lineHeight: 40, fontSize: 15, marginLeft: 20, fontFamily: 'Muli', fontWeight: 'bold', marginHorizontal: 13 }}>
                        Đến danh sách <Text style={{ color: '#F1802E' }}> Kết thúc</Text>
                    </Text>

                    <Image
                        style={{ marginRight: 20, height: 16, width: 9 }}
                        source={require('../../assets/icons/Arrow_right.png')}
                    />

                </View>
            </TouchableOpacity>
            <View style={{ marginTop: 30 }}>
                <CheckboxModest
                    checked={this.state.checkedTheoDoi}
                    label='Không hiện lại thông báo này'

                    labelStyle={{ fontSize: 15, color: '#5d5d5d' }}
                    checkedComponent={<Image
                        labelStyle={{ fontSize: 15 }}
                        style={{ height: 14, width: 14 }}
                        source={require('../../assets/icons/check.png')} />}
                    uncheckedComponent={<Image
                        style={{ height: 14, width: 14, marginTop: 2 }}
                        source={require('../../assets/icons/uncheck.png')} />}
                    onChange={() => { this.ChangeData(1) }}
                />
            </View>
            <TouchableOpacity onPress={() => this.setState({ visibleModalHoanTat: false, taskFollowing: null })}>
                <Image
                    style={{ alignSelf: 'center', marginTop: 37, marginBottom: 22, marginRight: 20, height: 22, width: 74 }}
                    source={require('../../assets/icons/dong.png')}
                />
            </TouchableOpacity>

        </View>
    );
    renderModalHoanTat2 = () => (
        <View style={styles.modalContent}>
            <View style={{ flexDirection: "row", alignSelf: 'center' }}>
                <Image
                    style={{ marginLeft: 0, marginRight: 15, height: 24, width: 24 }}
                    source={require('../../assets/icons/info.png')}
                />
                <Text style={{ fontFamily: 'Muli', fontWeight: 'bold', color: '#0092FF', fontSize: 15 }}>Gửi duyệt công việc</Text>
            </View>
            <Text style={{ marginTop: 20, fontFamily: 'Muli', color: '#5d5d5d', fontSize: 15 }}>
                Công việc bạn được giao đã hoàn tất, bạn muốn:
            </Text>
            <TouchableOpacity onPress={() => this.ChangePageTaskChoDuyet()}>
                <View style={styles.ButtonInBox1}>
                    <Text style={{ alignSelf: 'center', flex: 1, height: 40, lineHeight: 40, fontSize: 15, marginLeft: 20, fontFamily: 'Muli', fontWeight: 'bold', marginHorizontal: 13 }}>
                        Gửi duyệt
                    </Text>

                </View>
            </TouchableOpacity>
            <Text style={{ marginTop: 10, fontFamily: 'Muli', color: '#5d5d5d', fontSize: 15 }}>
                Chuyển công việc đến ds<Text style={{ fontSize: 15, color: '#F1802E' }}> Chờ duyệt</Text>. </Text>
            <TouchableOpacity onPress={() => this.ChangePageTaskTheoDoi()}>
                <View style={styles.ButtonInBox1}>
                    <Text style={{ alignSelf: 'center', flex: 1, height: 40, lineHeight: 40, fontSize: 15, marginLeft: 20, fontFamily: 'Muli', fontWeight: 'bold', marginHorizontal: 13 }}>
                        Tạm hoãn
                    </Text>
                </View>
            </TouchableOpacity>
            <Text style={{ marginTop: 10, marginBottom: 30, fontFamily: 'Muli', color: '#5d5d5d', fontSize: 15 }}>
                Vẫn giữ công việc ở ds  <Text style={{ fontSize: 15, color: '#F1802E' }}> Theo dõi</Text>. </Text>
        </View>
    );
    ChangePageTaskKetThuc() {
        this.setState({
            visibleModalHoanTat: false
        });
        let taskConfig = {
            index: 2,
            TaskFollowingTab: 0,
            TaskApprovingTab: 1,
        }
        try {
            AsyncStorage.setItem('taskConfig', JSON.stringify(taskConfig));
            this.props.callbackFromParent({ Attribute: "ChangeApprovingTab", Tab: 2, CheckTab: 1 });
        } catch (error) {
            console.log("Error saving data" + error);
        }


    }
    ChangePageTaskChoDuyet() {
        this.EditGuiDuyet();
        this.setState({
            visibleModalHoanTat2: false
        });
        let taskConfig = {
            index: 1,
            TaskFollowingTab: 1,
            TaskApprovingTab: 0,
        }
        try {
            AsyncStorage.setItem('taskConfig', JSON.stringify(taskConfig));
            this.props.callbackFromParent({ Attribute: "ChangeApprovingTab", Tab: 2, CheckTab: 1 });
        } catch (error) {
            console.log("Error saving data" + error);
        }
    }
    ChangePageTaskTheoDoi() {
        this.EditGuiHoanTat();
        this.setState({
            visibleModalHoanTat2: false
        });
    }
    render() {
        if (this.state.taskFollowing) {
            return (
                <View style={styles.container}>
                    <Modal
                        isVisible={this.state.visibleModalHoanTat}
                        onBackdropPress={() => this.setState({ visibleModalHoanTat: false })}
                        animationIn="slideInLeft"
                        animationOut="slideOutRight">
                        {this.renderModalHoanTat()}
                    </Modal>
                    <Modal
                        isVisible={this.state.visibleModalHoanTat2}
                        onBackdropPress={() => this.setState({ visibleModalHoanTat2: false })}
                        animationIn="slideInLeft"
                        animationOut="slideOutRight">
                        {this.renderModalHoanTat2()}
                    </Modal>
                    {/* <CollapseView
                    collapse={this.state.collapse}
                    renderView={this._renderView}
                    renderCollapseView={this._renderCollapseView}
                    tension={0}
                /> */}
                    <Collapse isCollapsed={this.state.collapse} onToggle={(isCollapsed) => this.setState({ collapse: isCollapsed })}>>
                    <CollapseHeader>
                            <View style={styles.wrapper} >
                                <ConfirmDialog
                                    title="Bạn chắc chắn muốn xóa?"
                                    visible={this.state.dialogVisible}
                                    onTouchOutside={() => this.setState({ dialogVisible: false })}
                                    positiveButton={{
                                        title: "Xóa",
                                        onPress: () => this.EditGuiHoanTat()
                                    }}
                                    negativeButton={{
                                        title: "Hủy",
                                        onPress: () => this.setState({ dialogVisible: false })
                                    }} >
                                    <View>
                                    </View>
                                </ConfirmDialog>
                                <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 40, borderLeftWidth: 3, borderTopStartRadius: 3, borderTopEndRadius: 3, borderLeftColor: this.state.TrangThai.Color, borderBottomWidth: 1, borderBottomColor: '#c3c3c3' }}>
                                    <Text style={{ flex: 1, height: 40, lineHeight: 40, fontSize: 13, fontWeight: 'bold', marginHorizontal: 13, fontFamily: "Muli" }}>
                                        {this.state.taskFollowing.MoTaCongViec}
                                    </Text>
                                    <TouchableOpacity onPress={() => this.EditGhim()}>
                                        <Image
                                            style={{ marginRight: 30, height: 18, width: 18 }}
                                            source={(this.state.taskFollowing.Ghim) ? require('../../assets/icons/pinActive.png') : require('../../assets/icons/pin.png')}
                                            key={this.state.taskFollowing.Ghim}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.ChangePage('TaskEditScreen', this.state.taskFollowing)}>
                                        <Image
                                            style={{ marginRight: 15, height: 16, width: 9 }}
                                            source={require('../../assets/icons/Arrow_right.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </CollapseHeader>
                        <CollapseBody>
                            <View style={styles.collapseView}>
                                <View style={{ alignItems: 'center', height: 40, backgroundColor: '#f6f6f6', flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={this._onPressButton} style={{ marginRight: 25, height: 40, marginLeft: 16, flex: 1 }}>
                                        <Text style={{ fontSize: 13, width: 54, color: "#5d5d5d", }}>
                                            {this.state.taskFollowing.MaNhanSuThucHienChinh}
                                        </Text>
                                        <Text style={{ fontSize: 13, width: 54, color: "#5d5d5d", }}>
                                            {this.state.taskFollowing.TenNganNhanSuThucHienChinh}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this._onPressButton} style={{ marginRight: 15, height: 40 }}>
                                        <Text style={[{ fontSize: 13, width: 54, alignSelf: 'flex-end' }, moment(this.state.taskFollowing.KetThucEst).format('YYYY-MM-DD') >= moment(this.state.today).format('YYYY-MM-DD') ? { color: "#5d5d5d" } : { color: "red" }]}>
                                            {this.state.taskFollowing.KetThucEst ? moment(this.state.taskFollowing.KetThucEst).format('HH:mm') : 'chưa có'}
                                        </Text>
                                        <Text style={[{ fontSize: 13, width: 56, alignSelf: 'flex-end' }, moment(this.state.taskFollowing.KetThucEst).format('YYYY-MM-DD') >= moment(this.state.today).format('YYYY-MM-DD') ? { color: "#5d5d5d" } : { color: "red" }]}>
                                            {this.state.taskFollowing.KetThucEst ? moment(this.state.taskFollowing.KetThucEst).format('DD/MM/YY') : ''}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{ marginRight: 35 }}>
                                        <TouchableOpacity onPress={() => this.EditPercent()} >
                                            <Progress.Circle textStyle={{ fontSize: 12 }} showsText={true} color={(this.state.taskFollowing.MucDoHoanThanh === 100) ? '#5cb800' : '#5a6276'} progress={this.state.taskFollowing.MucDoHoanThanh / 100} size={30} thickness={(this.state.taskFollowing.MucDoHoanThanh === 100) ? 1 : 2} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginRight: 10 }}>
                                        <View style={this.state.taskFollowing.MucDoHoanThanh == 100 ? { display: 'none', visibility: 'hidden', opacity: 0 } : {}}>
                                            <Checkbox
                                                checked={this.state.taskFollowing.MucDoHoanThanh == 100}
                                                style={{ backgroundColor: 'transparent', borderColor: '#707070', color: '#707070', borderRadius: 50, marginTop: 0 }}
                                                onChange={() => this.GuiDuyetTaskConfirm()} />
                                        </View>

                                        <View style={this.state.taskFollowing.MucDoHoanThanh == 100 ? {} : { display: 'none', visibility: 'hidden', opacity: 0 }}>
                                            <Checkbox
                                                checked={this.state.taskFollowing.MucDoHoanThanh == 100}
                                                style={{ backgroundColor: 'transparent', borderColor: '#5cb800', color: '#5cb800', borderRadius: 50, marginTop: 0 }}
                                                onChange={() => this.GuiDuyetTaskConfirm()} />
                                        </View>
                                    </View>

                                    <TouchableOpacity onPress={() => this.GuiDuyetTaskConfirm()} style={[{ marginRight: 15 }, this.state.taskFollowing.IDTrangThai == GLOBAL.defaultTrangThai.ChoDuyet ? { display: 'none', visibility: 'hidden', opacity: 0 } : {}]}>
                                        <Text style={[(this.state.taskFollowing.MucDoHoanThanh === 100) ? styles.hoantatActive : styles.hoantat]}>
                                            Hoàn tất
                                    </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[{ marginRight: 15 }, this.state.taskFollowing.IDTrangThai != GLOBAL.defaultTrangThai.ChoDuyet ? { display: 'none', visibility: 'hidden', opacity: 0 } : {}]}>
                                        <Text style={[(this.state.taskFollowing.MucDoHoanThanh === 100) ? styles.hoantatActive : styles.hoantat, { color: '#C3C3C3' }]}>
                                            Hoàn tất
                                    </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </CollapseBody>
                    </Collapse>
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
    inputIconUser: {
        width: 15,
        height: 15,
        marginLeft: 15,
        justifyContent: 'center'
    },
    hoantat: {
        fontWeight: "bold", fontSize: 13, height: 40, lineHeight: 40, color: "#5d5d5d", alignSelf: 'flex-end'
    },
    hoantatActive: {
        fontWeight: "bold", fontSize: 13, height: 40, lineHeight: 40, color: "#5cb800", alignSelf: 'flex-end'
    },
    hoantatCheckbox: {
        backgroundColor: 'transparent', borderColor: '#707070', color: '#707070', borderRadius: 50, marginTop: 0
    },
    hoantatCheckboxActive: {
        backgroundColor: 'transparent', borderColor: '#5cb800', color: '#5cb800', borderRadius: 50, marginTop: 0
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
    wrapper: {
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 3,
        margin: 0,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: 'red',
        shadowOpacity: 1,
        elevation: 3,
        zIndex: 999,
    },
    wrapperBody: {
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 3,
        margin: 10,
        marginBottom: 0,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: 'red',
        shadowOpacity: 1,
        elevation: 3,
        zIndex: 999,
    },
    container: {
        flex: 1
    },
    view: {
        height: 50,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    collapseView: {
        backgroundColor: 'white',
        backgroundColor: '#FFF',
        borderRadius: 3,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        margin: 0,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 0,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: 'red',
        shadowOpacity: 1,
        elevation: 3,
        zIndex: 999,

    },
    modalContent: {
        backgroundColor: "white",
        paddingLeft: 26,
        paddingRight: 26,
        paddingTop: 20,
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    iconView: {
        padding: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
    }
});