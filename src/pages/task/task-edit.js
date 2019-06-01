import React, { Component } from "react";
import { AsyncStorage, FlatList, ScrollView, Switch, TouchableOpacity, View, Dimensions, style, TextInput, Text, Button, CheckBox, Picker, StyleSheet, Image } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TaskService from "../../share/services/task.service";
import TaskCheckEditService from "../../share/services/task-check-edit.service";
import ModalDropdown from 'react-native-modal-dropdown';
import Modal from "react-native-modal";
// import moment from "moment";
import { findItem } from '../../share/services/ultility';
// import { SelectPicker, DatePicker } from 'react-native-select-picker';
import CustomSelectPicker from "../../share/customize/select-picker";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from 'moment';
const GLOBAL = require('../../share/global.js');
import * as Progress from '../../share/customize/react-native-progress';
const DEMO_OPTIONS_2 = [
    { "name": "Rex", "age": 30 },
    { "name": "Mary", "age": 25 },
    { "name": "John", "age": 41 },
    { "name": "Jim", "age": 22 },
    { "name": "Susan", "age": 52 },
    { "name": "Brent", "age": 33 },
    { "name": "Alex", "age": 16 },
    { "name": "Ian", "age": 20 },
    { "name": "Phil", "age": 24 },
];
const DEMO_OPTIONS_1 = ['option 1', 'option 2', 'option 3', 'option 4', 'option 5', 'option 6', 'option 7', 'option 8', 'option 9'];
const _today = moment().format("YYYY-MM-DD");
export default class TaskEdit extends Component {
    initialState = "2019-03-15";
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.navigation.state.params.params,
            taskFather: {},
            taskFatherBack: this.props.navigation.state.params.fatherBack,
            lstTrangThai: [],
            TrangThaiDefault: this.props.navigation.state.params.params.IDTrangThai,
            iconShow: true,
            lstDoUuTien: GLOBAL.lstDoUuTien,
            DoUuTienDefault: this.props.navigation.state.params.params.IDUuTien,
            visibleModalEndTime: false,
            visibleModalStartTime: false,
            visibleModalRemind: false,
            visibleModalEndTimeRemind: false,
            visibleModalNotify: false,
            AllDay: this.props.navigation.state.params.params.IsAllDay,
            _markedDates: moment(this.props.navigation.state.params.params.KetThucEst).format('YYYY-MM-DD'),
            _markedStartDates: moment(this.props.navigation.state.params.params.BatDau).format('YYYY-MM-DD'),
            EndHours: moment(this.props.navigation.state.params.params.KetThucEst).format('hh'),
            EndMinutes: moment(this.props.navigation.state.params.params.KetThucEst).format('mm'),
            EndAMPM: moment(this.props.navigation.state.params.params.KetThucEst).format('A'),
            StartHours: moment(this.props.navigation.state.params.params.BatDau).format('hh'),
            StartMinutes: moment(this.props.navigation.state.params.params.BatDau).format('mm'),
            StartAMPM: moment(this.props.navigation.state.params.params.BatDau).format('A'),
            isStartTime: true,
            isEndTime: false,
            isStartTimeRemind: this.props.navigation.state.params.params.NhacNho,
            isEndTimeRemind: this.props.navigation.state.params.params.NhacNhoKetThuc,
            EndTimeRemindNumber: this.props.navigation.state.params.params.ThoiGianNhacNhoKetThuc ? this.props.navigation.state.params.params.ThoiGianNhacNhoKetThuc : 0,
            StartTimeRemindNumber: this.props.navigation.state.params.params.ThoiGianNhacNho ? this.props.navigation.state.params.params.ThoiGianNhacNho : 0,
            lstRemindType: GLOBAL.lstThoiGian,
            StartTimeRemindType: {},
            EndTimeRemindType: {},
            organization: false,
            departmentList: [],
            employeeList: [],
            departmentListStr: '',
            outputList: [],
            outputTotal: 0,
            inputList: [],
            inputTotal: 0,
            tasklst: [],
            childNumber: 0,
            checkNotify: {}
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.task != nextProps.task) {
            this.setState({ task: nextProps.task });
        }
    }
    componentWillMount() {
        this.DepartmentList();
        this.EmployeeList();
        this.OutputList();
        this.InputList();
        let a = moment(this.props.navigation.state.params.params.KetThucEst).format('A');
        let lstTrangThaiTheoTask = TaskService.DanhSachTrangThaiTheoTask(this.state.task);
        GLOBAL.lstTrangThai
        this.state.lstTrangThai = lstTrangThaiTheoTask;
        // do something after the stars are rendered
        for (i = 0; i < this.state.lstTrangThai.length; i++) {
            if (this.state.task.IDTrangThai == this.state.lstTrangThai[i].ID) {
                this.setState({ TrangThaiDefault: i });
            }
        }

        this.LoadChild();


        for (i = 0; i < this.state.lstDoUuTien.length; i++) {
            if (this.state.task.IDUuTien == this.state.lstDoUuTien[i].ID) {
                this.setState({ DoUuTienDefault: i });
            }
        }
        for (i = 0; i < this.state.lstRemindType.length; i++) {
            if (this.state.task.LoaiThoiGianNhacNho == this.state.lstRemindType[i].ID) {
                this.setState({ StartTimeRemindType: this.state.lstRemindType[i] });
            }
        }
        for (i = 0; i < this.state.lstRemindType.length; i++) {
            if (this.state.task.LoaiThoiGianNhacNhoKetThuc == this.state.lstRemindType[i].ID) {
                this.setState({ EndTimeRemindType: this.state.lstRemindType[i] });
            }
        }
        // if (this.state.task.BatDau && this.state.task.BatDau != null) {
        //     this.setState({ isStartTime: true });
        // } else {
        //     this.setState({ isStartTime: false });
        // }
        if (this.state.task.KetThucEst && this.state.task.KetThucEst != null) {
            this.setState({ isEndTime: true });
        } else {
            this.setState({ isEndTime: false });
        }
        GLOBAL.lstDoUuTien;
        GLOBAL.lstPhanLoai;
        GLOBAL.lstNhan;
    }
    componentDidMount() {

    }
    LoadChild() {
        AsyncStorage.getItem('task').then((res, error) => {
            if (res) {
                let taskObject = JSON.parse(res)
                let taskArr = [];
                this.state.childNumber = 0;
                this.state.taskFather = {};
                taskObject.forEach(element => {
                    element.ListTask.Data.forEach(element1 => {
                        taskArr.push(element1);
                        if (element1.IDParent == this.state.task.ID) {
                            this.state.childNumber++;
                        }
                        if (element1.ID == this.state.task.IDParent) {
                            this.state.taskFather = element1;
                        }
                    });
                });
                this.setState({
                    tasklst: taskArr,
                    taskFather: this.state.taskFather,
                    childNumber: this.state.childNumber
                });
            } else {

            }
        });
    }
    ChangePage(page, params, fatherBack) {
        this.setState({
            visibleModal: false
        });
        this.props.navigation.push(page, {
            params,
            fatherBack,
            onGoBack: (task, fatherBack) => this.refresh(task, fatherBack),
        });
    }
    BackPage() {
        this.props.navigation.state.params.onGoBack(this.state.task, this.state.taskFatherBack);
        this.props.navigation.goBack();
    }
    refresh(task, fatherBack) {
        this.props.navigation.state;
        this.LoadChild();
        // this.props.callbackFromParent({ Attribute: "ChangeData" });
        if (fatherBack) {
            this.setState({
                task: this.state.task,
                departmentListStr: ''
            });
            this.DepartmentList();
            this.EmployeeList();
            this.OutputList();
            this.InputList();
        } else {
            this.setState({
                task: task,
                departmentListStr: ''
            });
            this.DepartmentList();
            this.EmployeeList();
            this.OutputList();
            this.InputList();
        }



    }
    OutputList() {
        let param = { "Page": 1, "PageSize": 50, "Filter": "IDCongViec~eq~" + this.state.task.ID + "~and~Type~eq~1", "Sort": "" };
        TaskService.LayDanhKetQuaDauRa(param).then((res) => {
            let outputObject = JSON.parse(res);
            this.state.outputTotal = 0;
            outputObject.Data.forEach(element => {
                this.state.outputTotal = this.state.outputTotal + element.listFile.length;
                if (element.LoaiKetQua == 1) {
                    this.state.outputTotal += 1;
                }
            });

            this.setState({ outputList: outputObject.Data, outputTotal: this.state.outputTotal })
        });
    }
    InputList() {
        let param = { "Page": 1, "PageSize": 50, "Filter": "IDCongViec~eq~" + this.state.task.ID + "~and~Type~eq~0", "Sort": "" };

        TaskService.LayDanhKetQuaDauRa(param).then((res) => {
            let inputObject = JSON.parse(res);
            this.state.inputTotal = 0
            inputObject.Data.forEach(element => {
                this.state.inputTotal = this.state.inputTotal + element.listFile.length;
                if (element.LoaiKetQua == 1) {
                    this.state.inputTotal += 1;
                }
            });
            this.setState({ inputList: inputObject.Data, inputTotal: this.state.inputTotal })
        });
    }
    DepartmentList() {
        let param = { "IDCongViec": this.state.task.ID, "EditItem": { "Page": 1, "PageSize": 50, "Filter": "", "Sort": "" }, "includeList": this.state.task.lstBoPhanThucHien }
        if (this.state.organization) {
            TaskService.LayDanhSachBoPhan(param).then((res) => {
                let departmentObject = JSON.parse(res);
                try {
                    AsyncStorage.setItem('DanhSachBoPhan', res);
                } catch (error) {
                    console.log("Error saving data" + error);
                }
                this.setState({ departmentList: departmentObject.Data, employeeListStand: departmentObject.Data })
            });
        } else {
            TaskService.LayDanhSachBoPhanKhongThuocCoCau(param).then((res) => {
                let departmentObject = JSON.parse(res);
                try {
                    AsyncStorage.setItem('DanhSachBoPhanKhongThuocCoCau', res);
                } catch (error) {
                    console.log("Error saving data" + error);
                }
                for (j = 0; j < departmentObject.Data.length; j++) {
                    for (i = 0; i < this.state.task.lstBoPhanThucHien.length; i++) {
                        if (this.state.task.lstBoPhanThucHien[i] == departmentObject.Data[j].ID) {
                            if (this.state.departmentListStr.indexOf(departmentObject.Data[j].Ma) < 0) {
                                this.state.departmentListStr = this.state.departmentListStr + departmentObject.Data[j].Ma + ' - ' + departmentObject.Data[j].Ten + "\n";
                            }
                        }
                    }
                }
                this.setState({ departmentList: departmentObject.Data, departmentListStand: departmentObject.Data, departmentListStr: this.state.departmentListStr })
            });
        }


    }
    EmployeeList() {
        let param = { "IDCongViec": this.state.task.ID, "EditItem": { "Page": 1, "PageSize": 50, "Filter": "", "Sort": "" }, excludeList: [], "includeList": this.state.task.lstNhanSuThucHien }
        if (this.state.organization) {
            TaskService.LayDanhSachNhanSu(param).then((res) => {
                let employeeObject = JSON.parse(res);
                try {
                    AsyncStorage.setItem('DanhSachNhanSu', res);
                } catch (error) {
                    console.log("Error saving data" + error);
                }
                this.setState({ employeeList: employeeObject.Data, employeeListStand: employeeObject.Data })
            });
        } else {
            TaskService.LayDanhSachNhanSuKhongTheoCoCau(param).then((res) => {
                let employeeObject = JSON.parse(res);
                try {
                    AsyncStorage.setItem('DanhSachNhanSuKhongTheoCoCau', res);
                } catch (error) {
                    console.log("Error saving data" + error);
                }
                for (j = 0; j < employeeObject.Data.length; j++) {
                    for (i = 0; i < this.state.task.lstNhanSuThucHien.length; i++) {
                        if (this.state.task.lstNhanSuThucHien[i] == employeeObject.Data[j].ID) {
                            if (this.state.departmentListStr.indexOf(employeeObject.Data[j].Ma) < 0) {
                                this.state.departmentListStr = this.state.departmentListStr + employeeObject.Data[j].Ma + ' - ' + employeeObject.Data[j].Ten + "\n";

                            }
                        }
                    }
                }
                this.setState({ employeeList: employeeObject.Data, employeeListStand: employeeObject.Data, departmentListStr: this.state.departmentListStr })
            });
        }
    }
    EditData(editField) {
        let params = { EditField: editField, EditItem: this.state.task };

        if (editField = 'MoTaCongViec') {
            this.state.checkNotify = TaskCheckEditService.checkEditName(this.state.task);
        }
        if (editField = 'DienGiai') {
            this.state.checkNotify = TaskCheckEditService.checkEditDescription(this.state.task);
        }
        if (this.state.checkNotify.result) {
            TaskService.EditData(params).then((res) => {
                let taskObject = JSON.parse(res)
            });
        } else {
            // hiển thị popup thông báo
            this.setState({ visibleModalNotify: true });
        }

    }
    EditStatus(index) {
        this.setState({ TrangThaiDefault: index, iconShow: true });
        index = parseInt(index);
        this.state.task.IDTrangThai = this.state.lstTrangThai[index].ID;
        let params = { EditField: "IDTrangThai", EditItem: this.state.task };
        this.setState({ task: this.state.task });
        TaskService.EditData(params).then((res) => {

        });
    }
    EditDoUuTien(index) {
        this.setState({ DoUuTienDefault: index, iconShow: true });
        index = parseInt(index);
        this.state.task.IDUuTien = this.state.lstDoUuTien[index].ID;
        let params = { EditField: "IDUuTien", EditItem: this.state.task }
        TaskService.EditData(params).then((res) => {
        });
    }
    EditPercent() {
        this.state.checkNotify = TaskCheckEditService.checkEditProgess(this.state.task);
        if (this.state.checkNotify.result) {
            this.state.task.MucDoHoanThanh = this.state.task.MucDoHoanThanh + 25;
            if (this.state.task.MucDoHoanThanh > 100) {
                this.state.task.MucDoHoanThanh = 0
            }
            this.setState({
                task: this.state.task
            });
            let params = { EditField: 'MucDoHoanThanh', EditItem: this.state.task }
            TaskService.EditData(params).then((res) => {
                let taskObject = JSON.parse(res)
                // để cái này bên trên cho nó chạy nhanh hơn
                this.setState({
                    task: taskObject.Data[0]
                });
            });
        } else {
            // hiển thị popup thông báo
            this.setState({ visibleModalNotify: true });
        }
    }
    EditTime(FlagTime) {
        if (this.state.AllDay) {
            this.state.task.IsAllDay = this.state.AllDay;
            this.state.StartHours = '00';
            this.state.StartMinutes = '00';
            this.state.EndHours = '00';
            this.state.EndMinutes = '00';
        } else {
            this.state.task.IsAllDay = this.state.AllDay;
        }

        // Trước khi có giá trị thì isEndTime = false vì thế phải bật cờ khi lưu
        // Không phải bật cờ isStartTime bởi vị đã bật cờ rồi mới có thể thay đổi ngày bắt đầu
        if (FlagTime == 'EndTimeFlag') {
            this.state.isEndTime = true;
            this.setState({ isEndTime: true });
            this.state.checkNotify = TaskCheckEditService.checkEditEndTime(this.state.task);
        }
        if (FlagTime == 'StartTimeFlag') {
            this.state.checkNotify = TaskCheckEditService.checkEditStartTime(this.state.task);

        }

        if (this.state.isEndTime) {
            var strKetThucEst = this.state._markedDates + ' ' + this.state.EndHours + ':' + this.state.EndMinutes + ':00' + ' ' + this.state.EndAMPM
            var DateKetThucEst = moment(strKetThucEst, "YYYY-MM-DD hh:mm:ss A");
            var DateKetThucEst1 = moment("01:15:00 PM", "h:mm:ss A").format("HH:mm:ss")// moment(DateKetThucEst).format("YYYY-MM-DDTHH:mm:ss");
            this.state.task.KetThucEst = DateKetThucEst;
            this.state.task.KhoangThoiGian = 0;

        }
        // thời gian kết thúc

        if (this.state.isStartTime) {
            // thời gian bắt đầu
            var strBatDau = this.state._markedStartDates + ' ' + this.state.StartHours + ':' + this.state.StartMinutes + ' ' + this.state.StartAMPM
            var DateBatDau = moment(strBatDau, "YYYY-MM-DD hh:mm:ss A");
            this.state.task.BatDau = DateBatDau;
            this.state.task.KhoangThoiGian = 0;
        }
        // bỏ thời gian bắt đầu
        if (!this.state.isStartTime) {
            // thời gian bắt đầu
            this.state.task.BatDau = null;
            this.state.task.KhoangThoiGian = 0
        }
        // hàm tính khoảng thời gian
        if (this.state.isStartTime && this.state.isEndTime) {

            this.state.task.KhoangThoiGian = moment(this.state._markedDates, "YYYY-MM-DD").diff(moment(this.state._markedStartDates, "YYYY-MM-DD"), 'days') + 1; // +1 để tính luôn ngày hiện tại
        }
        // thời gian nhắc nhở trước khi bắt đầu
        if (FlagTime == 'StartTimeRemind') {
            this.state.checkNotify = TaskCheckEditService.checkEditStartTimeBefor(this.state.task);
            if (this.state.checkNotify.result) {
                this.state.task.LoaiThoiGianNhacNho = this.state.StartTimeRemindType.ID;
                this.state.task.ThoiGianNhacNho = this.state.StartTimeRemindNumber;
                this.state.task.NhacNho = this.state.isStartTimeRemind;
            }
        }
        // thời gian nhắc nhở trước khi bắt đầu
        if (FlagTime == 'EndTimeRemind') {

            this.state.checkNotify = TaskCheckEditService.checkEditEndTimeBefor(this.state.task);
            if (this.state.checkNotify.result) {
                this.state.task.LoaiThoiGianNhacNhoKetThuc = this.state.EndTimeRemindType.ID;
                this.state.task.ThoiGianNhacNhoKetThuc = this.state.EndTimeRemindNumber;
                this.state.task.NhacNhoKetThuc = this.state.isEndTimeRemind;
            }
        }
        if (this.state.isStartTime && this.state.isEndTime && this.state.task.KhoangThoiGian && this.state.task.KhoangThoiGian < 0) {
            alert("Thời gian bắt đầu phải lớn hơn thời gian kết thúc");
            if (FlagTime == 'EndTimeFlag') {
                this.state.isEndTime = false;
                this.state.task.KetThucEst = null;
            }
            if (FlagTime == 'StartTimeFlag') {
                this.state.isStartTime = false;
                this.state.task.BatDau = null;
            }

        } else {
            // this.setState({
            //     task: this.state.task,
            //     visibleModalEndTime: false,
            //     visibleModalStartTime: false,
            //     visibleModalEndTimeRemind: false,
            //     visibleModalRemind: false
            // });

            let params = { EditField: 'editTime', EditItem: this.state.task }
            if (this.state.checkNotify.result) {
                TaskService.EditData(params).then((res) => {
                    let taskObject = JSON.parse(res);
                    // để cái này bên trên cho nó chạy nhanh hơn
                    this.setState({
                        task: taskObject.Data[0],
                        visibleModalEndTime: false,
                        visibleModalStartTime: false,
                        visibleModalEndTimeRemind: false,
                        visibleModalRemind: false
                    });
                });
            } else {
                // hiển thị popup thông báo
                this.setState({ visibleModalNotify: true });
            }
        }

    }
    // bộ dropdown render
    _dropdown_2_renderButtonText(rowData) {
        const { name, age } = rowData;
        return `${name}`;
    }
    _dropdown_2_renderRow(rowData, rowID, highlighted) {
        // highlighted là vị trí selected
        // let icon = highlighted ? require('../../assets/icons/pinActive.png') : require('../../assets/icons/pin.png');
        // let evenRow = rowID % 2;
        // let color = this.state.lstTrangThai[rowID].Color;
        // this.setState({ iconShow: true });
        return (
            <TouchableOpacity underlayColor='cornflowerblue'>
                <View style={[styles.dropdown_2_row, { backgroundColor: rowData.Color }]}>
                    {/* <Image style={styles.dropdown_2_image}
                        mode='stretch'
                        source={icon}
                    /> */}
                    <Text style={[styles.dropdown_2_row_text, highlighted && { color: '#FFF' }]}>
                        {rowData.Name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
    _dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        if (rowID == DEMO_OPTIONS_1.length - 1) return;
        let key = `spr_${rowID}`;
        return (<View style={styles.dropdown_2_separator}
            key={key}
        />);
    }
    //
    // bộ dropdown render
    _dropdown_StartTimeRemind_renderRow(rowData, rowID, highlighted) {
        // highlighted là vị trí selected
        return (
            <TouchableOpacity underlayColor='cornflowerblue'>
                <View style={[styles.dropdown_StartTimeRemind_row]}>
                    <Text style={[styles.dropdown_StartTimeRemind_row_text, highlighted && { color: '#0092FF' }]}>
                        {rowData.Ten}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
    _dropdown_StartTimeRemind_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        // Dải phân cách
        if (rowID == GLOBAL.lstThoiGian.length - 1) return;
        let key = `spr_${rowID}`;
        return (<View style={styles.dropdown_StartTimeRemind_separator}
            key={key}
        />);
    }
    //
    // bộ dropdown render
    _dropdown_EndTimeRemind_renderRow(rowData, rowID, highlighted) {
        // highlighted là vị trí selected
        return (
            <TouchableOpacity underlayColor='cornflowerblue'>
                <View style={[styles.dropdown_EndTimeRemind_row]}>
                    <Text style={[styles.dropdown_EndTimeRemind_row_text, highlighted && { color: '#0092FF' }]}>
                        {rowData.Ten}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
    _dropdown_EndTimeRemind_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        // Dải phân cách
        if (rowID == GLOBAL.lstThoiGian.length - 1) return;
        let key = `spr_${rowID}`;
        return (<View style={styles.dropdown_EndTimeRemind_separator}
            key={key}
        />);
    }
    //
    _dropdown_ut_renderButtonText(rowData) {
        const { name, age } = rowData;
        return `${name}`;
    }
    _dropdown_ut_renderRow(rowData, rowID, highlighted) {
        // highlighted là vị trí selected
        // let icon = highlighted ? require('../../assets/icons/pinActive.png') : require('../../assets/icons/pin.png');
        // let evenRow = rowID % 2;
        // let color = this.state.lstTrangThai[rowID].Color;
        // this.setState({ iconShow: true });
        return (
            <TouchableOpacity underlayColor='cornflowerblue'>
                <View style={[styles.dropdown_ut_row, { borderColor: rowData.Color, color: rowData.Color }]}>
                    {/* <Image style={styles.dropdown_2_image}
                        mode='stretch'
                        source={icon}
                    /> */}
                    <Text style={[styles.dropdown_ut_row_text, { borderColor: rowData.Color, color: rowData.Color, borderWidth: 1 }]}>
                        {rowData.Name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
    _dropdown_ut_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        if (rowID == DEMO_OPTIONS_1.length - 1) return;
        let key = `spr_${rowID}`;
        return (<View style={styles.dropdown_ut_separator}
            key={key}
        />);
    }

    valChange = (item, index) => {
        console.log('值改变', item, index);
        this.setState({
            picker: item
        })
    }
    // for single selection
    onDaySelect(day) {
        console.log('date', day);
        this.setState({
            _markedDates: day.dateString
        });
    }
    // Chọn ngày bắt đầu của calendar
    // for single selection
    onStartDaySelect(day) {
        console.log('date', day);
        this.setState({
            _markedStartDates: day.dateString
        });
    }
    renderModalEndDay = () => (
        <View style={styles.modalContent}>
            <View style={{
                height: 48, flexDirection: 'row', backgroundColor: '#EFF1F6', paddingLeft: 26,
                paddingRight: 26,
            }}>
                <Text style={{ lineHeight: 48, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                    THỜI HẠN
                    </Text>
            </View>
            <View style={{ paddingLeft: 24, paddingRight: 24 }}>
                <Calendar
                    style={{
                        paddingRight: 0,
                        paddingLeft: 0,
                        marginRight: 0,
                        marginLeft: 0
                    }}
                    onDayPress={this.onDaySelect.bind(this)}
                    markingType={"custom"}
                    markedDates={{
                        // [_today]: {
                        //     customStyles: {
                        //         container: {
                        //             backgroundColor: "lightgrey"
                        //         },
                        //         text: {
                        //             color: "black",
                        //             fontWeight: "bold"
                        //         }
                        //     }
                        // },
                        [this.state._markedDates]: {
                            customStyles: {
                                container: {
                                    backgroundColor: "#5A6276"
                                },
                                text: {
                                    color: "#FFF",
                                    fontSize: 15
                                }
                            }
                        }
                    }}
                />
            </View>
            <View style={{
                flexDirection: "row", paddingLeft: 35, paddingRight: 35,
                borderTopColor: '#C3C3C3', borderBottomColor: '#C3C3C3', borderBottomWidth: 1, borderTopWidth: 1,
                paddingTop: 10, paddingBottom: 10
            }}>
                <CustomSelectPicker
                    itemHeight={20}
                    wrapHeight={60}
                    IsAllDay={this.state.AllDay}
                    defaultValue={this.state.EndHours}
                    data={['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']}
                    bottomItem={{ borderWidth: 0 }}
                    onValueChange={(value, index) => this.setState({ EndHours: value })}
                />
                <Text style={[{ marginLeft: 24, marginRight: 24, marginTop: 20 }, this.state.AllDay ? { color: '#C3C3C3' } : { color: '#3498DB' }]}>
                    :
                    </Text>
                <CustomSelectPicker
                    itemHeight={20}
                    wrapHeight={60}
                    IsAllDay={this.state.AllDay}
                    defaultValue={this.state.EndMinutes}
                    data={['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
                        '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']}
                    bottomItem={{ borderWidth: 0 }}
                    onValueChange={(value, index) => this.setState({ EndMinutes: value })}
                />
                <View style={{ marginLeft: 42 }}>
                    <CustomSelectPicker
                        itemHeight={20}
                        wrapHeight={60}
                        IsAllDay={this.state.AllDay}
                        defaultValue={this.state.EndAMPM}
                        data={['AM', 'PM']}
                        bottomItem={{ borderWidth: 0 }}
                        onValueChange={(value) => this.setState({ EndAMPM: value })}
                    />
                </View>
                <View style={{ flex: 1 }}>

                </View>
                <View style={{ marginRight: 0 }}>
                    <Text>
                        Cả ngày
                    </Text>
                    <Switch
                        style={{ marginTop: 12 }}
                        trackColor="#5CB800"
                        thumbColor="#009688"
                        onValueChange={(value) => this.setState({ AllDay: value })}
                        value={this.state.AllDay} />
                </View>
            </View>


            <View style={{ flexDirection: 'row', }}>
                <View style={{ flex: 1 }}></View>
                <TouchableOpacity onPress={() => this.setState({ visibleModalEndTime: false })}>
                    <Image
                        style={{ marginTop: 35, marginBottom: 22, marginRight: 50, height: 22, width: 73 }}
                        source={require('../../assets/icons/dong.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.EditTime('EndTimeFlag')}>
                    <Text
                        style={{ color: '#3498DB', marginTop: 37, marginBottom: 22, marginRight: 35 }}
                    >
                        LƯU
                </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    renderModalStartDay = () => (
        <View style={styles.modalContent}>
            <View style={{
                height: 48, flexDirection: 'row', backgroundColor: '#EFF1F6', paddingLeft: 26,
                paddingRight: 26,
            }}>
                <Text style={{ lineHeight: 48, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                    NGÀY BẮT ĐẦU
                    </Text>
                <View style={{ flex: 1 }}>

                </View>
                <Switch
                    style={{ marginRight: 40 }}
                    trackColor="#5CB800"
                    thumbColor="#009688"
                    onValueChange={(value) => this.setState({ isStartTime: value })}
                    value={this.state.isStartTime} />
            </View>
            <View style={this.state.isStartTime ? { display: 'flex' } : { display: 'none' }}>
                <View style={{ paddingLeft: 24, paddingRight: 24 }}>

                    <Calendar
                        style={{
                            paddingRight: 0,
                            paddingLeft: 0,
                            marginRight: 0,
                            marginLeft: 0
                        }}
                        onDayPress={(day) => this.onStartDaySelect(day)}
                        markingType={"custom"}
                        markedDates={{
                            // [_today]: {
                            //     customStyles: {
                            //         container: {
                            //             backgroundColor: "lightgrey"
                            //         },
                            //         text: {
                            //             color: "black",
                            //             fontWeight: "bold"
                            //         }
                            //     }
                            // },
                            [this.state._markedStartDates]: {
                                customStyles: {
                                    container: {
                                        backgroundColor: "#5A6276"
                                    },
                                    text: {
                                        color: "#FFF",
                                        fontSize: 15
                                    }
                                }
                            }
                        }}
                    />
                </View>
                <View style={{
                    flexDirection: "row", paddingLeft: 35, paddingRight: 35,
                    borderTopColor: '#C3C3C3', borderBottomColor: '#C3C3C3', borderBottomWidth: 1, borderTopWidth: 1,
                    paddingTop: 10, paddingBottom: 10
                }}>
                    <CustomSelectPicker
                        itemHeight={20}
                        wrapHeight={60}
                        IsAllDay={this.state.AllDay}
                        defaultValue={this.state.StartHours}
                        data={['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']}
                        bottomItem={{ borderWidth: 0 }}
                        onValueChange={(value, index) => this.setState({ StartHours: value })}
                    />
                    <Text style={[{ marginLeft: 24, marginRight: 24, marginTop: 20 }, this.state.AllDay ? { color: '#C3C3C3' } : { color: '#3498DB' }]}>
                        :
    </Text>
                    <CustomSelectPicker
                        itemHeight={20}
                        wrapHeight={60}
                        IsAllDay={this.state.AllDay}
                        defaultValue={this.state.StartMinutes}
                        data={['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                            '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
                            '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']}
                        bottomItem={{ borderWidth: 0 }}
                        onValueChange={(value, index) => this.setState({ StartMinutes: value })}
                    />
                    <View style={{ marginLeft: 42 }}>
                        <CustomSelectPicker
                            itemHeight={20}
                            wrapHeight={60}
                            IsAllDay={this.state.AllDay}
                            defaultValue={this.state.StartAMPM}
                            data={['AM', 'PM']}
                            bottomItem={{ borderWidth: 0 }}
                            onValueChange={(value) => this.setState({ StartAMPM: value })}
                        />
                    </View>
                    <View style={{ flex: 1 }}>

                    </View>
                    <View style={{ marginRight: 0 }}>
                        <Text>
                            Cả ngày
    </Text>
                        <Switch
                            style={{ marginTop: 12 }}
                            trackColor="#5CB800"
                            thumbColor="#009688"
                            onValueChange={(value) => this.setState({ AllDay: value })}
                            value={this.state.AllDay} />
                    </View>
                </View>
            </View>



            <View style={{ flexDirection: 'row', }}>
                <View style={{ flex: 1 }}></View>
                <TouchableOpacity onPress={() => this.setState({ visibleModalStartTime: false })}>
                    <Image
                        style={{ marginTop: 35, marginBottom: 22, marginRight: 50, height: 22, width: 73 }}
                        source={require('../../assets/icons/dong.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.EditTime('StartTimeFlag')}>
                    <Text
                        style={{ color: '#3498DB', marginTop: 37, marginBottom: 22, marginRight: 35 }}
                    >
                        LƯU
                </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    StartTimeRemindTypeChange(index, value) {
        this.setState({ StartTimeRemindType: value });
    }
    EndTimeRemindTypeChange(index, value) {
        this.setState({ EndTimeRemindType: value });
    }

    renderModalEndTimeRemind = () => (
        <View style={styles.modalContent}>
            <View style={{
                height: 48, flexDirection: 'row', backgroundColor: '#EFF1F6', paddingLeft: 26,
                paddingRight: 26,
            }}>
                <Text style={{ lineHeight: 48, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                    THÔNG BÁO THỜI HẠN
                    </Text>
                <View style={{ flex: 1 }}>

                </View>
                <Switch
                    style={{ marginRight: 40 }}
                    trackColor="#5CB800"
                    thumbColor="#009688"
                    onValueChange={(value) => this.setState({ isEndTimeRemind: value })}
                    value={this.state.isEndTimeRemind} />
            </View>

            <View style={[{ flexDirection: 'row', marginTop: 24 }, this.state.isEndTimeRemind ? { display: 'flex' } : { display: 'none' }]}>
                <Text style={{ fontSize: 15, marginLeft: 24, marginRight: 14, lineHeight: 40 }}>
                    Trước
                </Text>
                <TextInput
                    style={{ paddingLeft: 14, fontSize: 15, width: 90, height: 40, borderWidth: 1, borderRadius: 3, borderColor: '#C3C3C3' }}
                    keyboardType='numeric'
                    onChangeText={(text) => this.setState({ EndTimeRemindNumber: text })}
                    value={this.state.EndTimeRemindNumber.toString()}
                    maxLength={10}  //setting limit of input
                />
                <ModalDropdown
                    style={{ marginLeft: 14, width: 90, height: 40, borderWidth: 1, borderRadius: 3, borderColor: '#C3C3C3' }}
                    dropdownStyle={{ width: 90, height: 193 }}
                    onSelect={(index, value) => this.EndTimeRemindTypeChange(index, value)}
                    options={GLOBAL.lstThoiGian}
                    renderRow={this._dropdown_EndTimeRemind_renderRow.bind(this)}
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_EndTimeRemind_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                >
                    <View style={{ flexDirection: 'row', height: 40 }}>
                        <Text style={{ paddingLeft: 14, fontSize: 15, flex: 1, lineHeight: 40 }}>
                            {this.state.EndTimeRemindType.Ten}
                        </Text>
                        <Icon name={"chevron-down"} size={25} style={{ lineHeight: 40 }} />
                    </View>
                </ModalDropdown>
            </View>

            <View style={{ flexDirection: 'row', }}>
                <View style={{ flex: 1 }}></View>
                <TouchableOpacity onPress={() => this.setState({ visibleModalEndTimeRemind: false })}>
                    <Image
                        style={{ marginTop: 35, marginBottom: 22, marginRight: 50, height: 22, width: 73 }}
                        source={require('../../assets/icons/dong.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.EditTime('EndTimeRemind')}>
                    <Text
                        style={{ color: '#3498DB', marginTop: 37, marginBottom: 22, marginRight: 35 }}
                    >
                        LƯU
                </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    renderModalStartTimeRemind = () => (
        <View style={styles.modalContent}>
            <View style={{
                height: 48, flexDirection: 'row', backgroundColor: '#EFF1F6', paddingLeft: 26,
                paddingRight: 26,
            }}>
                <Text style={{ lineHeight: 48, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                    NGÀY BẮT ĐẦU
                    </Text>
                <View style={{ flex: 1 }}>

                </View>
                <Switch
                    style={{ marginRight: 40 }}
                    trackColor="#5CB800"
                    thumbColor="#009688"
                    onValueChange={(value) => this.setState({ isStartTimeRemind: value })}
                    value={this.state.isStartTimeRemind} />
            </View>

            <View style={[{ flexDirection: 'row', marginTop: 24 }, this.state.isStartTimeRemind ? { display: 'flex' } : { display: 'none' }]}>
                <Text style={{ fontSize: 15, marginLeft: 24, marginRight: 14, lineHeight: 40 }}>
                    Trước
                </Text>
                <TextInput
                    style={{ paddingLeft: 14, fontSize: 15, width: 90, height: 40, borderWidth: 1, borderRadius: 3, borderColor: '#C3C3C3' }}
                    keyboardType='numeric'
                    // defaultValue={this.state.StartTimeRemindNumber.toString()}
                    onChangeText={(text) => this.setState({ StartTimeRemindNumber: text })}
                    value={this.state.StartTimeRemindNumber.toString()}
                    maxLength={10}  //setting limit of input
                />
                <ModalDropdown
                    style={{ marginLeft: 14, width: 90, height: 40, borderWidth: 1, borderRadius: 3, borderColor: '#C3C3C3' }}
                    dropdownStyle={{ width: 90, height: 193 }}
                    onSelect={(index, value) => this.StartTimeRemindTypeChange(index, value)}
                    options={GLOBAL.lstThoiGian}
                    renderRow={this._dropdown_StartTimeRemind_renderRow.bind(this)}
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_StartTimeRemind_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                >
                    <View style={{ flexDirection: 'row', height: 40 }}>
                        <Text style={{ paddingLeft: 14, fontSize: 15, flex: 1, lineHeight: 40 }}>
                            {this.state.StartTimeRemindType.Ten}
                        </Text>
                        <Icon name={"chevron-down"} size={25} style={{ lineHeight: 40 }} />
                    </View>
                </ModalDropdown>
            </View>

            <View style={{ flexDirection: 'row', }}>
                <View style={{ flex: 1 }}></View>
                <TouchableOpacity onPress={() => this.setState({ visibleModalRemind: false })}>
                    <Image
                        style={{ marginTop: 35, marginBottom: 22, marginRight: 50, height: 22, width: 73 }}
                        source={require('../../assets/icons/dong.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.EditTime('StartTimeRemind')}>
                    <Text
                        style={{ color: '#3498DB', marginTop: 37, marginBottom: 22, marginRight: 35 }}
                    >
                        LƯU
                </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    OpenModalEndTime() {
        this.setState({
            visibleModalEndTime: true
        });

    }
    OpenModalStartTime() {
        this.setState({
            visibleModalStartTime: true
        });

    }
    OpenModalRemind() {
        this.setState({
            visibleModalRemind: true
        });
    }
    OpenModalEndTimeRemind() {
        this.setState({
            visibleModalEndTimeRemind: true
        });
    }
    EditGhim() {
        this.state.task.Ghim = !this.state.task.Ghim;
        let params = { EditField: 'Ghim', EditItem: this.state.task }
        TaskService.EditData(params).then((res) => {
            let taskObject = JSON.parse(res)
            this.setState({
                task: taskObject.Data[0]
            });
        });
    }
    renderModalNotify = () => (
        <View style={styles.modalContent}>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Image
                    style={{ marginLeft: 16, marginRight: 15, width: 25, height: 25 }}
                    source={require('../../assets/icons/danger1.png')}
                />
                <Text style={{ flex: 1, fontFamily: 'Muli', fontWeight: 'bold', color: '#ff0000', fontSize: 15 }}>{this.state.checkNotify.title}</Text>
            </View>
            <Text style={{ marginTop: 20, marginLeft: 16, marginRight: 16, fontFamily: 'Muli', color: '#5d5d5d', fontSize: 13 }}>
                {this.state.checkNotify.description}
            </Text>
            <TouchableOpacity onPress={() => this.setState({ visibleModalNotify: false })}>
                <Image
                    style={{ alignSelf: 'center', marginTop: 37, marginBottom: 22, marginRight: 20, height: 22, width: 74 }}
                    source={require('../../assets/icons/dong.png')}
                />
            </TouchableOpacity>
        </View>
    );
    EditExecuteBy() {
        this.state.checkNotify = TaskCheckEditService.checkEditExecuteBy(this.state.task);
        if (this.state.checkNotify.result) {
            this.ChangePage('EmployeeScreen', this.state.task);
        } else {
            // hiển thị popup thông báo
            this.setState({ visibleModalNotify: true });
        }
    }
    EditRelationship() {
        this.state.checkNotify = TaskCheckEditService.checkEditRelationstaff(this.state.task);
        if (this.state.checkNotify.result) {
            this.ChangePage('EmployeeRelationshipScreen', this.state.task)
        } else {
            // hiển thị popup thông báo
            this.setState({ visibleModalNotify: true });
        }
    }
    render() {
        return (
            <View style={[styles.scene, { backgroundColor: '#EDEFF3' }]} >
                <View style={styles.header} >
                    <TouchableOpacity onPress={() => this.BackPage()}>
                        <Image
                            style={{ marginTop: 19, marginLeft: 10, marginRight: 12, height: 17, width: 9 }}
                            source={require('../../assets/icons/Arrow_left.png')}
                        />
                        {/* <Icon name="chevron-left" size={30} color="#5D5D5D" style={{ lineHeight: 54, marginLeft: 10, marginRight: 12 }} /> */}
                    </TouchableOpacity>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 11, backgroundColor: '#f6f6f6', borderRadius: 16, height: 32 }}>
                        <TextInput
                            style={{ padding: 0, flex: 1, marginLeft: 16 }}
                            placeholder="Nhập tên..."
                            value={this.state.task.MoTaCongViec}
                            onChangeText={(text) => this.setState({
                                task: {
                                    ...this.state.task,
                                    MoTaCongViec: text,
                                },
                            })}
                            onBlur={() => this.EditData('MoTaCongViec')}
                        />
                        <Image
                            style={{ marginLeft: 0, marginTop: 8, marginLeft: 10, marginRight: 12, height: 15, width: 14 }}
                            source={require('../../assets/icons/edit.png')}
                        />
                    </View>
                </View>
                <ScrollView>
                    <View style={{ height: 40, flexDirection: 'row' }}>
                        <Image
                            style={{ marginTop: 10, marginLeft: 16, marginRight: 12, width: 20, height: 20 }}
                            source={require('../../assets/icons/menu.png')}
                        />
                        <Text style={{ lineHeight: 40, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            Thông tin chung
                    </Text>
                    </View>
                    <View style={{
                        height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1
                    }}>
                        <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 19 }}>
                            Trạng thái
                    </Text>
                        <ModalDropdown ref="dropdown_2"
                            style={[styles.dropdown_2, this.state.lstTrangThai[this.state.TrangThaiDefault] ? { backgroundColor: this.state.lstTrangThai[this.state.TrangThaiDefault].Color } : {}]}
                            textStyle={styles.dropdown_2_text}
                            dropdownStyle={styles.dropdown_2_dropdown}
                            onSelect={(index, value) => this.EditStatus(index)}
                            defaultIndex={parseInt(this.state.TrangThaiDefault)}
                            options={this.state.lstTrangThai}
                            renderRow={this._dropdown_2_renderRow.bind(this)}
                            renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                        >

                            <View style={{ flexDirection: 'row', height: 24 }}>

                                <Text style={{ paddingLeft: 8, fontSize: 13, color: "#FFF", flex: 1, lineHeight: 24 }}>
                                    {this.state.lstTrangThai[this.state.TrangThaiDefault] ? this.state.lstTrangThai[this.state.TrangThaiDefault].Name : ''}
                                </Text>
                                <Icon name={this.state.iconShow ? "chevron-down" : "chevron-up"} size={16} color="#FFF" style={{ lineHeight: 24 }} />
                            </View>

                        </ModalDropdown>

                    </View>
                    <View style={{ height: 88, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 46 }}>
                            Mô tả
                    </Text>

                        <View style={{ flex: 1, flexDirection: 'row', marginTop: 11, height: 65 }}>
                            <TextInput
                                style={{ padding: 0, flex: 1, padding: 0, margin: 0, textAlignVertical: 'top' }}
                                placeholder="Nhập mô tả..."
                                value={this.state.task.DienGiai}
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={(text) => this.setState({
                                    task: {
                                        ...this.state.task,
                                        DienGiai: text,
                                    },
                                })}
                                onBlur={() => this.EditData('DienGiai')}
                            />
                            <Image
                                style={{ marginLeft: 0, marginTop: 8, marginLeft: 10, marginRight: 12, height: 15, width: 14 }}
                                source={require('../../assets/icons/edit.png')}
                            />
                        </View>
                    </View>
                    <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 37 }}>
                            Ưu tiên
                    </Text>

                        <ModalDropdown ref="dropdown_ut"
                            style={[styles.dropdown_ut, { borderWidth: 1, borderColor: this.state.lstDoUuTien[this.state.DoUuTienDefault].Color }]}
                            textStyle={[styles.dropdown_ut_text, { color: this.state.lstDoUuTien[this.state.DoUuTienDefault].Color }]}
                            dropdownStyle={styles.dropdown_ut_dropdown}
                            onSelect={(index) => this.EditDoUuTien(index)}
                            defaultIndex={parseInt(this.state.DoUuTienDefaultDefault)}
                            options={this.state.lstDoUuTien}
                            renderRow={this._dropdown_ut_renderRow.bind(this)}
                            renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_ut_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                        >
                            <View style={{ flexDirection: 'row', height: 24 }}>

                                <Text style={{ paddingLeft: 8, fontSize: 13, color: this.state.lstDoUuTien[this.state.DoUuTienDefault].Color, flex: 1, lineHeight: 20 }}>
                                    {this.state.lstDoUuTien[this.state.DoUuTienDefault].Name}
                                </Text>
                                <Icon name={this.state.iconShow ? "chevron-down" : "chevron-up"} size={16} color={this.state.lstDoUuTien[this.state.DoUuTienDefault].Color} style={{ lineHeight: 24 }} />
                            </View>

                        </ModalDropdown>
                    </View>
                    <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 29 }}>
                            Việc cha
                    </Text>
                        <Text style={{ lineHeight: 40, flex: 1 }}>
                            {this.state.task.MoTaCongViecParent ? this.state.task.MoTaCongViecParent : 'không có'}
                        </Text>
                        <TouchableOpacity onPress={() => this.ChangePage('TaskEditScreen', this.state.taskFather, true)}>
                            <Image
                                style={[{ marginTop: 13, marginLeft: 16, marginRight: 15, width: 9, height: 16 }, this.state.task.MoTaCongViecParent ? { display: 'flex' } : { display: 'none' }]}
                                source={require('../../assets/icons/Arrow_right.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 29 }}>
                            Việc con
                    </Text>
                        <Text style={{ lineHeight: 40, flex: 1 }}>
                            Có <Text style={{ color: '#0092ff' }}> {this.state.childNumber}</Text> công việc con
                    </Text>
                        <TouchableOpacity onPress={() => this.ChangePage('TaskChildScreen', this.state.task)}>
                            <Image
                                style={{ marginTop: 13, marginLeft: 16, marginRight: 15, width: 9, height: 16 }}
                                source={require('../../assets/icons/Arrow_right.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 37 }}>
                            Tiến độ
                    </Text>
                        <View style={{ marginTop: 5 }}>
                            <TouchableOpacity onPress={() => this.EditPercent()} >
                                <Progress.Circle textStyle={{ fontSize: 12 }} showsText={true} color={(this.state.task.MucDoHoanThanh === 100) ? '#5cb800' : '#5a6276'} progress={this.state.task.MucDoHoanThanh / 100} size={30} thickness={(this.state.task.MucDoHoanThanh === 100) ? 1 : 2} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ height: 40, flexDirection: 'row' }}>
                        <Image
                            style={{ marginTop: 10, marginLeft: 16, marginRight: 12, width: 20, height: 20 }}
                            source={require('../../assets/icons/clock.png')}
                        />
                        <Text style={{ lineHeight: 40, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            Thời gian
                    </Text>
                    </View>
                    <View style={{ height: 58, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text style={{ marginLeft: 16, lineHeight: 58, marginRight: 28 }}>
                            Thời hạn
                    </Text>
                        <TouchableOpacity onPress={() => this.OpenModalEndTime()} style={{ marginRight: 34, height: 32, width: 80, marginTop: 11 }}>
                            <Text style={{ fontSize: 13, flex: 1, color: "#0092FF" }}>
                                {this.state.task.KetThucEst ? moment(this.state.task.KetThucEst).format('DD/MM/YYYY') : 'chưa có'}
                            </Text>
                            <Text style={{ fontSize: 13, flex: 1, color: "#0092FF" }}>
                                {this.state.task.KetThucEst ? moment(this.state.task.KetThucEst).format('HH:mm') : 'chưa có'}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ lineHeight: 58, marginRight: 32 }}>
                            Bắt đầu
                    </Text>
                        <TouchableOpacity onPress={() => this.OpenModalStartTime()} style={{ marginRight: 34, height: 32, width: 80, marginTop: 11 }}>
                            <Text style={{ fontSize: 13, flex: 1, color: "#0092FF" }}>
                                {this.state.task.BatDau ? moment(this.state.task.BatDau).format('DD/MM/YYYY') : 'chưa có'}
                            </Text>
                            <Text style={{ fontSize: 13, flex: 1, color: "#0092FF" }}>
                                {this.state.task.BatDau ? moment(this.state.task.BatDau).format('HH:mm') : 'chưa có'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 26 }}>
                            Nhắc nhở thời hạn
                    </Text>
                        {this.state.task.ThoiGianNhacNhoKetThuc ?
                            <Text style={{ lineHeight: 40, flex: 1 }}>
                                Trước {this.state.task.ThoiGianNhacNhoKetThuc} {GLOBAL.lstThoiGian[this.state.task.LoaiThoiGianNhacNhoKetThuc].Ten}
                            </Text>
                            :
                            <Text style={{ lineHeight: 40, flex: 1 }}>
                                Không có
                        </Text>
                        }
                        <TouchableOpacity onPress={() => this.OpenModalEndTimeRemind()}>
                            <Text style={{ height: 35, lineHeight: 35, flex: 1, color: "#0092ff", marginRight: 16 }}>
                                thay đổi
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 28 }}>
                            Nhắc nhở bắt đầu
                    </Text>
                        {this.state.task.ThoiGianNhacNho ?
                            <Text style={{ lineHeight: 40, flex: 1 }}>
                                Trước {this.state.task.ThoiGianNhacNho} {GLOBAL.lstThoiGian[this.state.task.LoaiThoiGianNhacNho].Ten}
                            </Text>
                            :
                            <Text style={{ lineHeight: 40, flex: 1 }}>
                                Không có
                        </Text>
                        }
                        <TouchableOpacity onPress={() => this.OpenModalRemind()}>
                            <Text style={{ height: 35, lineHeight: 35, flex: 1, color: "#0092ff", marginRight: 16 }}>
                                thay đổi
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 40, flexDirection: 'row' }}>
                        <Image
                            style={{ marginTop: 10, marginLeft: 16, marginRight: 12, width: 20, height: 20 }}
                            source={require('../../assets/icons/UserEdit.png')}
                        />
                        <Text style={{ lineHeight: 40, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            Nhân sự chịu trách nhiệm
                    </Text>
                    </View>
                    <TouchableOpacity onPress={() => this.EditExecuteBy()}>
                        <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                            <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 39 }}>
                                Thực hiện
                    </Text>
                            <Text style={{ lineHeight: 40, flex: 1 }}>
                                {this.state.task.MaNhanSuThucHienChinh} {this.state.task.MaNhanSuThucHienChinh ? '-' : 'không có'} {this.state.task.TenNhanSuThucHienChinh}
                            </Text>
                            <Image
                                style={{ marginTop: 13, marginLeft: 16, marginRight: 15, width: 9, height: 16 }}
                                source={require('../../assets/icons/Arrow_right.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.EditRelationship()}>
                        <View style={{ height: 56, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                            <Text style={{ marginLeft: 16, lineHeight: 36, marginRight: 38 }}>
                                Liên quan
                    </Text>
                            <View style={{ flex: 1, height: 32, marginTop: 11 }}>
                                <Text style={{ flex: 1, lineHeight: 16, height: 32 }}>
                                    {this.state.departmentListStr != '' ? this.state.departmentListStr : 'chưa có'}
                                </Text>
                            </View>
                            <Image
                                style={{ marginTop: 13, marginLeft: 16, marginRight: 15, width: 9, height: 16 }}
                                source={require('../../assets/icons/Arrow_right.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={{ height: 40, flexDirection: 'row' }}>
                        <Image
                            style={{ marginTop: 10, marginLeft: 16, marginRight: 12, width: 20, height: 20 }}
                            source={require('../../assets/icons/attach.png')}
                        />
                        <Text style={{ lineHeight: 40, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            Kết quả đầu ra & tài liệu
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => this.ChangePage('DocumentScreen', this.state.task)}>
                        <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                            <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 50 }}>
                                Kết quả
                        </Text>
                            <Text style={{ lineHeight: 40, flex: 1 }}>
                                Có <Text style={{ color: '#0092FF' }}>{this.state.outputTotal}</Text> kết quả đầu ra yêu cầu
                    </Text>

                            <Image
                                style={{ marginTop: 13, marginLeft: 16, marginRight: 15, width: 9, height: 16 }}
                                source={require('../../assets/icons/Arrow_right.png')}
                            />

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.ChangePage('DocumentScreen', this.state.task)}>
                        <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                            <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 54 }}>
                                Tài liệu
                    </Text>
                            <Text style={{ lineHeight: 40, flex: 1 }}>
                                Có <Text style={{ color: '#0092FF' }}>{this.state.inputTotal}</Text> tài liệu đính kèm
                </Text>

                            <Image
                                style={{ marginTop: 13, marginLeft: 16, marginRight: 15, width: 9, height: 16 }}
                                source={require('../../assets/icons/Arrow_right.png')}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={{ height: 40, flexDirection: 'row' }}>
                        <Image
                            style={{ marginTop: 10, marginLeft: 16, marginRight: 12, width: 20, height: 20 }}
                            source={require('../../assets/icons/AddCircle.png')}
                        />
                        <Text style={{ lineHeight: 40, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            Thông tin thêm
                    </Text>
                    </View>
                    <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 73 }}>
                            Tag
                    </Text>
                        <View style={{ flexDirection: 'row', height: 40, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                            <FlatList
                                data={this.state.task.lstNhan}
                                extraData={this.state}
                                keyExtractor={(item) => item.ID.toString()}
                                renderItem={({ item }) => <View style={{ paddingLeft: 5, paddingRight: 5, marginRight: 14, height: 18, backgroundColor: item.Color, borderRadius: 8, alignItems: 'center' }}>
                                    <Text style={{ color: '#FFF', lineHeight: 18 }}>{item.Name}</Text>
                                </View>}
                                maxToRenderPerBatch={1}
                                windowSize={5}
                                onEndReachedThreshold={0.5}
                                removeClippedSubviews={true}
                                disableVirtualization={true}
                                maxToRenderPerBatch={1}
                                initialNumToRender={5}
                                contentContainerStyle={{ flexDirection: 'row', height: 40, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}


                            />
                            <TouchableOpacity onPress={() => this.ChangePage('TagScreen', this.state.task)}>
                                <Image
                                    style={{ marginTop: 13, marginLeft: 16, marginRight: 15, width: 9, height: 16 }}
                                    source={require('../../assets/icons/Arrow_right.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 40 }}>
                            Phân loại
                    </Text>
                        <Text style={{ lineHeight: 40, flex: 1, color: '#C3C3C3' }}>
                            chưa có
                    </Text>
                        <TouchableOpacity onPress={() => this.setState({})}>
                            <Image
                                style={{ marginTop: 13, marginLeft: 16, marginRight: 15, width: 9, height: 16 }}
                                source={require('../../assets/icons/Arrow_right.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 52 }}>
                            Tạo bởi
                    </Text>
                        <Text style={{ lineHeight: 40, flex: 1, color: '#C3C3C3' }}>
                            {this.state.task.MaNhanSuTao} - {this.state.task.TenNganNhanSuTao}
                        </Text>
                    </View>
                    <View style={{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text style={{ marginLeft: 16, lineHeight: 40, marginRight: 64 }}>
                            Ghim
                    </Text>
                        <Text style={[{ lineHeight: 40, flex: 1 }, this.state.task.Ghim ? {} : { color: '#C3C3C3' }]}>
                            {this.state.task.Ghim ? 'Đã ghim' : 'Chưa ghim'}
                        </Text>
                        <TouchableOpacity onPress={() => this.EditGhim()}>
                            <Image
                                style={{ marginTop: 11, marginLeft: 16, marginRight: 15, width: 18, height: 18 }}
                                source={this.state.task.Ghim ? require('../../assets/icons/pinActive.png') : require('../../assets/icons/pin.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, height: 60 }}>
                        <Modal
                            isVisible={this.state.visibleModalNotify}
                            onBackdropPress={() => this.setState({ visibleModalNotify: false })}
                            animationIn="slideInLeft"
                            animationOut="slideOutRight">
                            {this.renderModalNotify()}
                        </Modal>
                        <Modal
                            isVisible={this.state.visibleModalEndTime}
                            onBackdropPress={() => this.setState({ visibleModalEndTime: false })}
                            animationIn="slideInLeft"
                            animationOut="slideOutRight">
                            {this.renderModalEndDay()}
                        </Modal>
                        <Modal
                            isVisible={this.state.visibleModalStartTime}
                            onBackdropPress={() => this.setState({ visibleModalStartTime: false })}
                            animationIn="slideInLeft"
                            animationOut="slideOutRight">
                            {this.renderModalStartDay()}
                        </Modal>
                        <Modal
                            isVisible={this.state.visibleModalRemind}
                            onBackdropPress={() => this.setState({ visibleModalRemind: false })}
                            animationIn="slideInLeft"
                            animationOut="slideOutRight">
                            {this.renderModalStartTimeRemind()}
                        </Modal>
                        <Modal
                            isVisible={this.state.visibleModalEndTimeRemind}
                            onBackdropPress={() => this.setState({ visibleModalEndTimeRemind: false })}
                            animationIn="slideInLeft"
                            animationOut="slideOutRight">
                            {this.renderModalEndTimeRemind()}
                        </Modal>
                    </View>
                </ScrollView>
            </View >
        );
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
    modalContent: {
        backgroundColor: "white",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    dropdown_2: {
        width: 104,
        height: 24,
        marginTop: 8,
        borderWidth: 0,
        borderRadius: 3,
    },
    dropdown_2_text: {
        color: 'white',
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 13, color: "#FFF", flex: 1, lineHeight: 24,
        paddingLeft: 8,
    },
    dropdown_2_dropdown: {
        width: 104,
        height: 100,
        borderColor: 'cornflowerblue',
        borderWidth: 2,
        borderRadius: 3,
    },
    dropdown_2_row: {
        flexDirection: 'row',
        height: 24,
        alignItems: 'center',
    },
    dropdown_2_image: {
        marginLeft: 4,
        width: 30,
        height: 30,
    },
    dropdown_2_row_text: {
        color: 'white',
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 13, color: "#FFF", flex: 1, lineHeight: 24,
        paddingLeft: 8,
    },
    dropdown_2_separator: {
        height: 1,
        backgroundColor: 'transparent',
    },
    dropdown_ut: {
        width: 160,
        height: 24,
        marginTop: 8,
        borderWidth: 0,
        borderRadius: 3,
    },
    dropdown_ut_text: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 13, flex: 1, lineHeight: 24,
        paddingLeft: 8,
    },
    dropdown_ut_dropdown: {
        width: 160,
        height: 100,
        borderWidth: 2,
        borderRadius: 3,
    },
    dropdown_ut_row: {
        flexDirection: 'row',
        height: 24,
        alignItems: 'center',
    },
    dropdown_ut_image: {
        marginLeft: 4,
        width: 30,
        height: 30,
    },
    dropdown_ut_row_text: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 13, flex: 1, lineHeight: 24,
        paddingLeft: 8,
    },
    dropdown_ut: {
        width: 160,
        height: 24,
        marginTop: 8,
        borderWidth: 0,
        borderRadius: 3,
    },
    dropdown_ut_text: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 13, flex: 1, lineHeight: 24,
        paddingLeft: 8,
    },
    dropdown_ut_dropdown: {
        width: 160,
        height: 100,
        borderWidth: 2,
        borderRadius: 3,
    },
    dropdown_ut_row: {
        flexDirection: 'row',
        height: 24,
        alignItems: 'center',
    },
    dropdown_ut_image: {
        marginLeft: 4,
        width: 30,
        height: 30,
    },
    dropdown_ut_row_text: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 13, flex: 1, lineHeight: 24,
        paddingLeft: 8,
    },
    //
    dropdown_StartTimeRemind: {
        width: 160,
        height: 24,
        marginTop: 8,
        borderWidth: 0,
        borderRadius: 3,
    },
    dropdown_StartTimeRemind_text: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 13, flex: 1, lineHeight: 24,
        paddingLeft: 8,
    },
    dropdown_StartTimeRemind_dropdown: {
        width: 160,
        height: 100,
        borderWidth: 2,
        borderRadius: 3,
    },
    dropdown_StartTimeRemind_row: {
        flexDirection: 'row',
        height: 32,
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    dropdown_StartTimeRemind_image: {
        marginLeft: 4,
        width: 30,
        height: 30,
    },
    dropdown_StartTimeRemind_row_text: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 15, flex: 1, lineHeight: 32,
        paddingLeft: 18,
        color: '#5D5D5D'
    },
    dropdown_StartTimeRemind_separator: {
        height: 1,
        backgroundColor: 'transparent',
    },
    //
    dropdown_EndTimeRemind: {
        width: 160,
        height: 24,
        marginTop: 8,
        borderWidth: 0,
        borderRadius: 3,
    },
    dropdown_EndTimeRemind_text: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 13, flex: 1, lineHeight: 24,
        paddingLeft: 8,
    },
    dropdown_EndTimeRemind_dropdown: {
        width: 160,
        height: 100,
        borderWidth: 2,
        borderRadius: 3,
    },
    dropdown_EndTimeRemind_row: {
        flexDirection: 'row',
        height: 32,
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    dropdown_EndTimeRemind_image: {
        marginLeft: 4,
        width: 30,
        height: 30,
    },
    dropdown_EndTimeRemind_row_text: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 15, flex: 1, lineHeight: 32,
        paddingLeft: 18,
        color: '#5D5D5D'
    },
    dropdown_EndTimeRemind_separator: {
        height: 1,
        backgroundColor: 'transparent',
    },

});