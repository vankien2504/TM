import React, { Component } from "react";
import { View, Dimensions, style, TextInput, Text, Button, Image, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
const GLOBAL = require('../../share/global.js');
import TaskService from "../../share/services/task.service";
const { height } = Dimensions.get('window')
export default class TaskBoxApprove extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            task: this.props.taskApproving,
            visibleModalHoanTat: false,
            visibleModalHoanTat2: false,
            dialogVisible: false,
            collapse: this.props.collapse,
            UuTien: {},
            TrangThai: {}
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.collapse != nextProps.collapse) {
            this.setState({ collapse: nextProps.collapse });
        }
        // console.log('====collapse', this.state.collapse)
        // console.log('====nextProps', nextProps.collapse)
    }
    componentWillMount() {
        GLOBAL.lstDoUuTien.forEach(element => {
            if (this.state.task.IDUuTien == element.ID) {
                this.state.UuTien = element
            }
        });
        GLOBAL.lstTrangThai.forEach(element => {
            if (this.state.task.IDTrangThai == element.ID) {
                this.state.TrangThai = element
            }
        });
    }
    EditGhim() {
        this.state.task.Ghim = !this.state.task.Ghim;
        let params = { EditField: 'Ghim', EditItem: this.state.task };
        this.setState({
            task: this.state.task
        });
        TaskService.EditData(params).then((res) => {
            let taskObject = JSON.parse(res)
            this.setState({
                task: taskObject.Data[0]
            });
        });
    }
    refresh(task) {
        this.props.navigation.state;
        this.props.callbackFromParent({ Attribute: "ChangeData" });
        this.setState({
            taskFollowing: task
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

    _renderView = (collapse) => {
        return (
            <View style={styles.wrapper} >
                <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 40, borderLeftWidth: 3, borderTopStartRadius: 3, borderTopEndRadius: 3, borderLeftColor: '#5cb800', borderBottomWidth: 1, borderBottomColor: '#c3c3c3' }}>
                    <Text style={{ flex: 1, height: 40, lineHeight: 40, fontSize: 13, fontWeight: 'bold', marginHorizontal: 13 }}>
                        {this.state.task.MoTaCongViec}
                    </Text>

                    <TouchableOpacity onPress={() => this.EditGhim()}>
                        <Image
                            style={{ marginRight: 30, height: 18, width: 18 }}
                            source={(this.state.task.Ghim) ? require('../../assets/icons/pinActive.png') : require('../../assets/icons/pin.png')}
                            key={this.state.task.Ghim}

                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.ChangePage('TaskEditScreen', this.state.task)}>
                        <Image
                            style={{ marginRight: 15, height: 16, width: 9 }}
                            source={require('../../assets/icons/Arrow_right.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    GuiDuyetTaskConfirm() {
        if (this.state.task.IDNhanSuTao != GLOBAL.userInfo.IDNhanSu) {
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
    EditGuiTra() {
        this.state.task.GuiHoanTat = false;
        let params = { EditField: 'GuiHoanTat', EditItem: this.state.task }

        TaskService.EditData(params).then((res) => {
            let taskObject = JSON.parse(res)
            this.setState({
                task: null
            });
        });

    }
    EditKhongDuyet() {
        this.state.task.IDTrangThai = GLOBAL.defaultTrangThai.KhongDuyet;
        let params = { EditField: 'closeWithReason', EditItem: this.state.task }
        TaskService.EditData(params).then((res) => {
            let taskObject = JSON.parse(res)
            this.setState({
                task: null
            });
        });
    }
    EditDuyet() {
        this.state.task.IDTrangThai = GLOBAL.defaultTrangThai.Dong;
        let params = { EditField: 'IDTrangThai', EditItem: this.state.task }

        TaskService.EditData(params).then((res) => {
            let taskObject = JSON.parse(res)
            // this.setState({
            //     task: null
            // });
            this.props.callbackFromParent({ Attribute: "RefeshData" });
        });
    }
    _renderCollapseView = (collapse) => {
        return (
            <View style={styles.collapseView}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 40, backgroundColor: '#f6f6f6', flexDirection: 'row' }}>
                    <Image style={styles.inputIconUser} source={require("../../assets/icons/User.png")} />
                    <Text style={{ flex: 1, fontSize: 13, marginLeft: 5 }}>{this.state.task.MaNhanSuThucHienChinh}-{this.state.task.TenNganNhanSuThucHienChinh}</Text>
                    <TouchableOpacity onPress={() => this.EditGuiTra()} style={{ marginRight: 30 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 13, height: 40, lineHeight: 40, color: "#5d5d5d", alignItems: 'flex-end' }}>
                            Trả về
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.EditKhongDuyet()} style={{ marginRight: 15 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 13, width: 40, height: 40, lineHeight: 20, color: "#5d5d5d", alignSelf: 'flex-end', }}>
                            Không duyệt
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.EditDuyet()} style={{ marginRight: 15 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 13, height: 40, lineHeight: 40, color: "#5d5d5d", alignSelf: 'flex-end', }}>
                            Duyệt
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    render() {
        if (this.state.task) {
            return (
                <View style={styles.container}>
                    <Collapse isCollapsed={this.state.collapse} onToggle={(isCollapsed) => this.setState({ collapse: isCollapsed })}>>
                    <CollapseHeader>
                            <View style={styles.wrapper} >
                                <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 40, borderLeftWidth: 3, borderTopStartRadius: 3, borderTopEndRadius: 3, borderLeftColor: this.state.TrangThai.Color, borderBottomWidth: 1, borderBottomColor: '#c3c3c3' }}>
                                    <Text style={{ flex: 1, height: 40, lineHeight: 40, fontSize: 13, fontWeight: 'bold', marginHorizontal: 13 }}>
                                        {this.state.task.MoTaCongViec}
                                    </Text>

                                    <TouchableOpacity onPress={() => this.EditGhim()}>
                                        <Image
                                            style={{ marginRight: 30, height: 18, width: 18 }}
                                            source={(this.state.task.Ghim) ? require('../../assets/icons/pinActive.png') : require('../../assets/icons/pin.png')}
                                            key={this.state.task.Ghim}

                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.ChangePage('TaskEditScreen', this.state.task)}>
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
                                <View style={{ justifyContent: 'center', alignItems: 'center', height: 40, backgroundColor: '#f6f6f6', flexDirection: 'row' }}>
                                    <Image style={styles.inputIconUser} source={require("../../assets/icons/User.png")} />
                                    <Text style={{ flex: 1, fontSize: 13, marginLeft: 5 }}>{this.state.task.MaNhanSuThucHienChinh}-{this.state.task.TenNganNhanSuThucHienChinh}</Text>
                                    <TouchableOpacity onPress={() => this.EditGuiTra()} style={{ marginRight: 30 }}>
                                        <Text style={{ fontWeight: "bold", fontSize: 13, height: 40, lineHeight: 40, color: "#5d5d5d", alignItems: 'flex-end' }}>
                                            Trả về
                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.EditKhongDuyet()} style={{ marginRight: 15 }}>
                                        <Text style={{ fontWeight: "bold", fontSize: 13, width: 40, height: 40, lineHeight: 20, color: "#5d5d5d", alignSelf: 'flex-end', }}>
                                            Không duyệt
                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.EditDuyet()} style={{ marginRight: 15 }}>
                                        <Text style={{ fontWeight: "bold", fontSize: 13, height: 40, lineHeight: 40, color: "#5d5d5d", alignSelf: 'flex-end', }}>
                                            Duyệt
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
        marginLeft: 10,
        justifyContent: 'center'
    },
    wrapper: {
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
        margin: 10,
        marginBottom: 0,
        marginTop: 0,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: 'red',
        shadowOpacity: 1,
        elevation: 3,
        zIndex: 999,

    },
    iconView: {
        padding: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
    }
});