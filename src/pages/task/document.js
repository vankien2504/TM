import React, { Component } from "react";
import { AsyncStorage, FlatList, TouchableOpacity, Image, View, Dimensions, style, TextInput, Text, Button, CheckBox, Alert, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
const GLOBAL = require('../../share/global.js');
import TaskService from "../../share/services/task.service";
import CheckboxModest from 'react-native-modest-checkbox'
export default class Document extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.navigation.state.params.params,
            outputList: [],
            inputList: [],
            outputTotal: 0,
            outputCalendarTotal: 0,
            outputLinkTotal: 0,
            outputFileTotal: 0,
            inputTotal: 0,
            inputCalendarTotal: 0,
            inputLinkTotal: 0,
            inputFileTotal: 0,
            collapse: true,
            collapseInput: true,
            newLoaiKetQua: 0,
            newMoTa: ''
        }
    }
    ChangePage(page, params) {
        this.props.navigation.navigate(page, {
            params,
            onGoBack: (task) => this.refresh(task),
        });
    }
    BackPage() {
        this.props.navigation.state.params.onGoBack(this.state.task);
        this.props.navigation.goBack();
    }
    refresh(task) {
        this.props.navigation.state;
        // this.props.callbackFromParent({ Attribute: "ChangeData" });
        this.OutputList();
        this.InputList();
    }
    componentWillMount() {
        this.OutputList();
        this.InputList();
    }
    OutputList() {
        let param = { "Page": 1, "PageSize": 50, "Filter": "IDCongViec~eq~" + this.state.task.ID + "~and~Type~eq~1", "Sort": "" };
        TaskService.LayDanhKetQuaDauRa(param).then((res) => {
            let outputObject = JSON.parse(res)
            this.state.outputTotal = 0;
            this.state.outputLinkTotal = 0;
            this.state.outputFileTotal = 0;
            this.state.outputCalendarTotal = 0;
            outputObject.Data.forEach(element => {
                this.state.outputTotal = this.state.outputTotal + element.listFile.length;
                if (element.LoaiKetQua == 2) {
                    this.state.outputLinkTotal = this.state.outputLinkTotal + element.listFile.length
                }
                if (element.LoaiKetQua == 0) {
                    this.state.outputFileTotal = this.state.outputFileTotal + element.listFile.length
                }
                if (element.LoaiKetQua == 1) {
                    this.state.outputTotal += 1;
                    this.state.outputCalendarTotal = this.state.outputCalendarTotal + 1;
                }
            });
            this.setState({
                outputList: outputObject.Data,
                outputTotal: this.state.outputTotal,
                outputCalendarTotal: this.state.outputCalendarTotal,
                outputFileTotal: this.state.outputFileTotal,
                outputLinkTotal: this.state.outputLinkTotal
            })
        });
    }
    InputList() {
        let param = { "Page": 1, "PageSize": 50, "Filter": "IDCongViec~eq~" + this.state.task.ID + "~and~Type~eq~0", "Sort": "" };
        TaskService.LayDanhKetQuaDauRa(param).then((res) => {
            let inputObject = JSON.parse(res)
            this.state.inputTotal = 0;
            this.state.inputLinkTotal = 0;
            this.state.inputFileTotal = 0;
            this.state.inputCalendarTotal = 0;
            inputObject.Data.forEach(element => {
                this.state.inputTotal = this.state.inputTotal + element.listFile.length;
                if (element.LoaiKetQua == 2) {
                    this.state.inputLinkTotal = this.state.inputLinkTotal + element.listFile.length
                }
                if (element.LoaiKetQua == 0) {
                    this.state.inputFileTotal = this.state.inputFileTotal + element.listFile.length
                }
                if (element.LoaiKetQua == 1) {
                    this.state.inputTotal += 1;
                    this.state.inputCalendarTotal = this.state.inputCalendarTotal + 1;
                }
            });
            this.setState({
                inputList: inputObject.Data,
                inputTotal: this.state.inputTotal,
                inputCalendarTotal: this.state.inputCalendarTotal,
                inputFileTotal: this.state.inputFileTotal,
                inputLinkTotal: this.state.inputLinkTotal
            })
        });
    }

    OutputAdd(type) {

        let params = { "ID": 0, "IDCongViec": this.state.output.IDCongViec, "LoaiKetQua": this.state.newLoaiKetQua, "MoTa": this.newMoTa, Sort: 0, "Type": type, isValid: false, listFile: [], "uid": "" };
        TaskService.ThemMoiCongViec_KetQuaDauRa(params).then((res) => {
            let outputFileObject = JSON.parse(res)
            // this.state.output.listFile.unshift(outputFileObject.Data[0]);
            // this.CountLinkTotal();
            // this.setState({
            //     output: this.state.output,
            //     isAddLink: false,
            //     NewFileName: ''
            // });
        });
    }
    render() {
        return (
            <View style={[styles.scene, { backgroundColor: '#EDEFF3' }]} >
                <View style={styles.header} >
                    <TouchableOpacity onPress={() => this.BackPage()}>
                        <Image
                            style={{ marginTop: 19, marginLeft: 16, marginRight: 24, height: 17, width: 9 }}
                            source={require('../../assets/icons/Arrow_left.png')}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 54 }}>
                        Kết quả đầu ra & tài liệu
                        </Text>
                </View>
                <Collapse isCollapsed={this.state.collapse} onToggle={(isCollapsed) => this.setState({ collapse: isCollapsed })}>>
                    <CollapseHeader>
                        <View style={styles.wrapper} >
                            <Image
                                style={{ marginLeft: 16, marginRight: 15, height: 9, width: 17, marginTop: 16 }}
                                source={this.state.collapse ? require('../../assets/icons/Arrow_up.png') : require('../../assets/icons/Arrow_down.png')}
                            />
                            <Text style={{ lineHeight: 40, flex: 1, fontSize: 15, fontWeight: 'bold' }}>
                                Kết quả đầu ra
                            </Text>
                            <Text style={{ color: '#999999', marginRight: 16, lineHeight: 40, fontSize: 15, fontWeight: 'normal' }}>{this.state.outputTotal} kết quả</Text>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        <View style={styles.collapseView}>
                            <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                                <Text style={{ marginLeft: 16, lineHeight: 40, flex: 1 }}>
                                    Lịch hẹn
                                        </Text>
                                <Text style={[{ lineHeight: 40, width: 60, marginRight: 83, marginLeft: 47 }, this.state.outputCalendarTotal > 0 ? { color: '#0092FF' } : {}]}>
                                    {this.state.outputCalendarTotal > 0 ? this.state.outputCalendarTotal : ''} {this.state.outputCalendarTotal > 0 ? 'lịch hẹn' : 'chưa có'}
                                </Text>
                                <TouchableOpacity onPress={() => this.ChangePage('DocumentDetailScreen', this.state.task)}>
                                    <Image
                                        style={{ marginTop: 13, marginRight: 16, width: 9, height: 16 }}
                                        source={require('../../assets/icons/Arrow_right.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                                <Text style={{ marginLeft: 16, lineHeight: 40, flex: 1 }}>
                                    Liên kết
                                        </Text>
                                <Text style={[{ lineHeight: 40, width: 60, marginRight: 83, marginLeft: 47 }, this.state.outputLinkTotal > 0 ? { color: '#0092FF' } : {}]}>
                                    {this.state.outputLinkTotal > 0 ? this.state.outputLinkTotal : ''} {this.state.outputLinkTotal > 0 ? 'liên kết' : 'chưa có'}
                                </Text>
                                <TouchableOpacity onPress={() => this.ChangePage('DocumentDetailScreen', this.state.task)}>
                                    <Image
                                        style={{ marginTop: 13, marginRight: 16, width: 9, height: 16 }}
                                        source={require('../../assets/icons/Arrow_right.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                                <Text style={{ marginLeft: 16, lineHeight: 40, flex: 1 }}>
                                    File đính kèm
                                        </Text>
                                <Text style={[{ lineHeight: 40, width: 60, marginRight: 83, marginLeft: 47 }, this.state.outputFileTotal > 0 ? { color: '#0092FF' } : {}]}>
                                    {this.state.outputFileTotal > 0 ? this.state.outputFileTotal : ''} {this.state.outputFileTotal > 0 ? 'đính kèm' : 'chưa có'}
                                </Text>
                                <TouchableOpacity onPress={() => this.ChangePage('DocumentDetailScreen', this.state.task)}>
                                    <Image
                                        style={{ marginTop: 13, marginRight: 16, width: 9, height: 16 }}
                                        source={require('../../assets/icons/Arrow_right.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            {/* <FlatList
                                data={this.state.outputList}
                                extraData={this.state}
                                keyExtractor={(item) => item.ID.toString()}
                                renderItem={({ item }) =>
                                    <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                                        <Text style={{ marginLeft: 16, lineHeight: 40, flex: 1 }}>
                                            {item.MoTa}
                                        </Text>
                                        <Text style={[{ lineHeight: 40, width: 60, marginRight: 83, marginLeft: 47 }, item.listFile.length > 0 ? { color: '#0092FF' } : {}]}>
                                            {item.listFile.length > 0 ? item.listFile.length : ''} {item.listFile.length > 0 ? 'tài liệu' : 'không có'}
                                        </Text>
                                        <TouchableOpacity onPress={() => this.ChangePage('DocumentDetailScreen', item)}>
                                            <Image
                                                style={{ marginTop: 13, marginRight: 16, width: 9, height: 16 }}
                                                source={require('../../assets/icons/Arrow_right.png')}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                }
                            /> */}
                        </View>
                    </CollapseBody>
                </Collapse>
                <Collapse isCollapsed={this.state.collapseInput} onToggle={(isCollapsed) => this.setState({ collapseInput: isCollapsed })}>>
                    <CollapseHeader>
                        <View style={styles.wrapper} >
                            <Image
                                style={{ marginLeft: 16, marginRight: 15, height: 9, width: 17, marginTop: 16 }}
                                source={this.state.collapseInput ? require('../../assets/icons/Arrow_up.png') : require('../../assets/icons/Arrow_down.png')}
                            />
                            <Text style={{ lineHeight: 40, flex: 1, fontSize: 15, fontWeight: 'bold' }}>
                                Tài liệu đính kèm <Text style={{ lineHeight: 40, fontSize: 15, fontWeight: 'normal' }}>({this.state.inputTotal})</Text>
                            </Text>
                            <Text style={{ color: '#999999', marginRight: 16, lineHeight: 40, fontSize: 15, fontWeight: 'normal' }}>{this.state.inputTotal} tài liệu</Text>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        <View style={styles.collapseView}>
                            <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                                <Text style={{ marginLeft: 16, lineHeight: 40, flex: 1 }}>
                                    Lịch hẹn
                                        </Text>
                                <Text style={[{ lineHeight: 40, width: 60, marginRight: 83, marginLeft: 47 }, this.state.inputCalendarTotal > 0 ? { color: '#0092FF' } : {}]}>
                                    {this.state.inputCalendarTotal > 0 ? this.state.inputCalendarTotal : ''} {this.state.inputCalendarTotal > 0 ? 'lịch hẹn' : 'chưa có'}
                                </Text>
                                <TouchableOpacity onPress={() => this.ChangePage('DocumentInputDetailScreen', this.state.task)}>
                                    <Image
                                        style={{ marginTop: 13, marginRight: 16, width: 9, height: 16 }}
                                        source={require('../../assets/icons/Arrow_right.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                                <Text style={{ marginLeft: 16, lineHeight: 40, flex: 1 }}>
                                    Liên kết
                                        </Text>
                                <Text style={[{ lineHeight: 40, width: 60, marginRight: 83, marginLeft: 47 }, this.state.inputLinkTotal > 0 ? { color: '#0092FF' } : {}]}>
                                    {this.state.inputLinkTotal > 0 ? this.state.inputLinkTotal : ''} {this.state.inputLinkTotal > 0 ? 'liên kết' : 'chưa có'}
                                </Text>
                                <TouchableOpacity onPress={() => this.ChangePage('DocumentInputDetailScreen', this.state.task)}>
                                    <Image
                                        style={{ marginTop: 13, marginRight: 16, width: 9, height: 16 }}
                                        source={require('../../assets/icons/Arrow_right.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                                <Text style={{ marginLeft: 16, lineHeight: 40, flex: 1 }}>
                                    File đính kèm
                                        </Text>
                                <Text style={[{ lineHeight: 40, width: 60, marginRight: 83, marginLeft: 47 }, this.state.inputFileTotal > 0 ? { color: '#0092FF' } : {}]}>
                                    {this.state.inputFileTotal > 0 ? this.state.inputFileTotal : ''} {this.state.inputFileTotal > 0 ? 'đính kèm' : 'chưa có'}
                                </Text>
                                <TouchableOpacity onPress={() => this.ChangePage('DocumentInputDetailScreen', this.state.task)}>
                                    <Image
                                        style={{ marginTop: 13, marginRight: 16, width: 9, height: 16 }}
                                        source={require('../../assets/icons/Arrow_right.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            {/* <FlatList
                                data={this.state.inputList}
                                extraData={this.state}
                                keyExtractor={(item) => item.ID.toString()}
                                renderItem={({ item }) =>
                                    <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                                        <Text style={{ marginLeft: 16, lineHeight: 40, flex: 1 }}>
                                            {item.MoTa}
                                        </Text>
                                        <Text style={[{ lineHeight: 40, width: 60, marginRight: 83, marginLeft: 47 }, item.listFile.length > 0 ? { color: '#0092FF' } : {}]}>
                                            {item.listFile.length > 0 ? item.listFile.length : ''} {item.listFile.length > 0 ? 'tài liệu' : 'không có'}
                                        </Text>
                                        <TouchableOpacity onPress={() => this.ChangePage('DocumentDetailScreen', item)}>
                                            <Image
                                                style={{ marginTop: 13, marginRight: 16, width: 9, height: 16 }}
                                                source={require('../../assets/icons/Arrow_right.png')}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                }
                            /> */}
                        </View>
                    </CollapseBody>
                </Collapse>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    scene: {
        height: Dimensions.get('window').height
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
        height: 54,
    },
    wrapper: {
        height: 40,
        backgroundColor: '#FFF',
        margin: 0,
        marginTop: 17,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: 'red',
        shadowOpacity: 1,
        elevation: 3,
        zIndex: 999,
        flexDirection: 'row'
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
    collapseView: {
        backgroundColor: 'white',
        backgroundColor: '#FFF',
        borderRadius: 3,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        margin: 0,
        marginTop: 0,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: 'red',
        shadowOpacity: 1,
        elevation: 3,
        zIndex: 999,
    },
})
