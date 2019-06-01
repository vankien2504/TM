import React, { Component } from 'react';
import { Switch, ScrollView, Dimensions, FlatList, AsyncStorage, StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
const GLOBAL = require('../../share/global.js');
import TaskService from "../../share/services/task.service";
import Modal from "react-native-modal";
import SearchBar from 'react-native-material-design-searchbar';
import CheckboxModest from 'react-native-modest-checkbox';
import moment from 'moment';
import DateRangePicker from './DateRangePicker';
import CustomSelectPicker from "../../share/customize/select-picker";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import CustomIcon from '../../share/customize/iconCustomize/CustomIcon.js'
class TaskFilter extends Component {
    constructor(props) {
        super(props);
        let today = new Date();
        let date2 = new Date(new Date().setDate(today.getDate() - 30));
        let date3 = new Date(new Date().setDate(today.getDate() - 1));
        let dateStart = moment(date2).format('YYYY-MM-DD');
        let dateEnd = moment(today).format('YYYY-MM-DD');
        let yesterday = moment(date3).format('YYYY-MM-DD');
        this.state = {
            today: dateEnd,
            yesterday: yesterday,
            lstTrangThai: GLOBAL.lstTrangThai,
            lstDoUuTien: GLOBAL.lstDoUuTien,
            lstTag: GLOBAL.lstNhan,
            filterTask: {},

            employeeListStr: '',
            departmentListStr: '',

            visibleModalEmployee: false,
            visibleModalEndTime: false,

            employeeListStand: [],
            employeeList: [],

            departmentList: [],
            departmentListStand: [],

            _markedDates: [],

            isEmployee: true,
        };
    }
    componentWillMount() {


        AsyncStorage.getItem('filterTask').then((res, error) => {
            if (res) {
                let filterTaskObject = JSON.parse(res)

                this.setState({
                    filterTask: filterTaskObject
                });
            } else {
                let filterTask = {
                    employeeList: [],
                    departmentList: [],
                    fromDate: '',
                    toDate: '',
                    statusList: [],
                    priorityList: [],
                    tagList: []
                }
                this.setState({
                    filterTask: filterTask
                });
                try {
                    AsyncStorage.setItem('filterTask', JSON.stringify(filterTask));
                } catch (error) {
                    console.log("Error saving data" + error);
                }
            }
        });
        this.EmployeeList();
        this.DepartmentList();
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

    BackPage(type) {
        if (type == 'close') {
            let keys = ['filterTask'];
            AsyncStorage.multiRemove(keys, (err) => {

            });
        } else {

        }
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
    }
    Logout() {
        let keys = ['tokenObject', 'userInfo', 'taskConfig', 'task', 'lstTrangThai', 'lstDoUuTien'];
        AsyncStorage.multiRemove(keys, (err) => {
            this.props.navigation.navigate('LoginScreen', { tabPositions: 0 });
        });

        // AsyncStorage.removeItem('tokenObject').then((res, error) => {

        // });
    }
    EmployeeList() {
        let param = { "IDCongViec": 0, "EditItem": { "Page": 1, "PageSize": 50, "Filter": "", "Sort": "" }, excludeList: [], "includeList": [] }
        TaskService.LayDanhSachNhanSuKhongTheoCoCau(param).then((res) => {
            let employeeObject = JSON.parse(res);
            for (j = 0; j < employeeObject.Data.length; j++) {
                for (i = 0; i < this.state.filterTask.employeeList.length; i++) {
                    if (this.state.filterTask.employeeList[i] == employeeObject.Data[j].ID) {

                        this.state.employeeListStr = this.state.employeeListStr + employeeObject.Data[j].Ma + ' - ' + employeeObject.Data[j].Ten + "\n";

                    }
                }
            }
            this.setState({ employeeList: employeeObject.Data, employeeListStand: employeeObject.Data, employeeListStr: this.state.employeeListStr })
        });

    }
    DepartmentList() {
        let param = { "IDCongViec": 0, "EditItem": { "Page": 1, "PageSize": 50, "Filter": "", "Sort": "" }, "includeList": [] }
        TaskService.LayDanhSachBoPhanKhongThuocCoCau(param).then((res) => {
            let departmentObject = JSON.parse(res)
            for (j = 0; j < departmentObject.Data.length; j++) {
                for (i = 0; i < this.state.filterTask.departmentList.length; i++) {
                    if (this.state.filterTask.departmentList[i] == departmentObject.Data[j].ID) {
                        this.state.departmentListStr = this.state.departmentListStr + departmentObject.Data[j].Ma + ' - ' + departmentObject.Data[j].Ten + "\n";
                    }
                }
            }
            this.setState({ departmentList: departmentObject.Data, departmentListStand: departmentObject.Data, departmentListStr: this.state.departmentListStr })
        });
    }
    EditEmployee(ID) {

        let valueIndex = this.state.filterTask.employeeList.indexOf(ID);
        if (valueIndex > -1) {
            this.state.filterTask.employeeList.splice(valueIndex, 1);
        } else {
            this.state.filterTask.employeeList.push(ID);
        }
        try {
            AsyncStorage.setItem('filterTask', JSON.stringify(this.state.filterTask));

        } catch (error) {
            console.log("Error saving data" + error);
        }
        this.state.employeeListStr = '';
        for (j = 0; j < this.state.employeeList.length; j++) {
            for (i = 0; i < this.state.filterTask.employeeList.length; i++) {
                if (this.state.filterTask.employeeList[i] == this.state.employeeList[j].ID) {
                    if (this.state.employeeList.indexOf(this.state.employeeList[j].Ma) < 0) {
                        this.state.employeeListStr = this.state.employeeListStr + this.state.employeeList[j].Ma + ' - ' + this.state.employeeList[j].Ten + "\n";
                    }
                }
            }
        }
        this.setState({ filterTask: this.state.filterTask })
    }
    EditDepartment(ID) {

        let valueIndex = this.state.filterTask.departmentList.indexOf(ID);
        if (valueIndex > -1) {
            this.state.filterTask.departmentList.splice(valueIndex, 1);
        } else {
            this.state.filterTask.departmentList.push(ID);
        }
        try {
            AsyncStorage.setItem('filterTask', JSON.stringify(this.state.filterTask));

        } catch (error) {
            console.log("Error saving data" + error);
        }
        this.state.departmentListStr = '';
        for (j = 0; j < this.state.departmentList.length; j++) {
            for (i = 0; i < this.state.filterTask.departmentList.length; i++) {
                if (this.state.filterTask.departmentList[i] == this.state.departmentList[j].ID) {
                    if (this.state.departmentList.indexOf(this.state.departmentList[j].Ma) < 0) {
                        this.state.departmentListStr = this.state.departmentListStr + this.state.departmentList[j].Ma + ' - ' + this.state.departmentList[j].Ten + "\n";
                    }
                }
            }
        }
        this.setState({ filterTask: this.state.filterTask })
    }
    renderModalEmployee = () => (
        <View style={[styles.scene, { backgroundColor: '#EDEFF3' }]} >
            <View style={styles.header} >
                <TouchableOpacity onPress={() => this.setState({ isEmployee: true })}>
                    <View style={[{ height: 48, marginLeft: 40, }, this.state.isEmployee ? { borderBottomColor: '#F1802E', borderBottomWidth: 2 } : {}]}>
                        <Text style={[{ fontSize: 15, fontWeight: 'bold', lineHeight: 48, }, this.state.isEmployee ? { color: '#F1802E' } : {}]}>
                            NHÂN SỰ
                </Text>
                    </View>
                </TouchableOpacity>
                <View style={{ height: 48, flex: 1 }}>

                </View>
                <TouchableOpacity onPress={() => this.setState({ isEmployee: false })}>
                    <View style={[{ height: 48, marginRight: 40 }, !this.state.isEmployee ? { borderBottomColor: '#F1802E', borderBottomWidth: 2 } : {}]}>
                        <Text style={[{ fontSize: 15, fontWeight: 'bold', lineHeight: 48, marginRight: 40 }, !this.state.isEmployee ? { color: '#F1802E' } : {}]}>
                            BỘ PHẬN
                </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.searchBox} >
                <View style={{ flex: 1 }}>
                    <SearchBar
                        onSearchChange={text => this.searchFilterFunction(text)}
                        height={40}
                        onFocus={() => console.log('On Focus')}
                        onBlur={() => console.log('On Blur')}
                        placeholder={'Tìm kiếm...'}
                        inputStyle={{ padding: 0, paddingLeft: 15, paddingRight: 10, borderRadius: 3, backgroundColor: '#FFF', borderColor: "#FFF" }}
                        textStyle={{ padding: 0, fontFamily: "Muli", fontSize: 15, color: "#5d5d5d", backgroundColor: '#FFF' }}
                        padding={0}
                        iconPadding={0}
                        iconColor={'#5d5d5d'}
                        autoCorrect={false}
                        returnKeyType={'search'}
                    />
                </View>
            </View>
            <View style={[{ marginTop: 20 }, this.state.isEmployee ? { display: 'flex' } : { display: 'none' }]}>
                <FlatList
                    data={this.state.employeeList}
                    extraData={this.state}
                    keyExtractor={(item) => item.ID.toString()}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => this.EditEmployee(item.ID)}>
                            <View style={{ flexDirection: 'row', backgroundColor: '#FFF', height: 40, borderBottomColor: '#C3C3C3', borderBottomWidth: 1 }}>
                                <Text style={[{ lineHeight: 40, marginLeft: 16, flex: 1 }]}>
                                    {item.Ma} -  {item.Ten}
                                </Text>
                                <Image
                                    style={{ marginTop: 13, marginRight: 16, height: 14, width: 14 }}
                                    source={(this.state.filterTask.employeeList.indexOf(item.ID) > -1) ? require('../../assets/icons/check.png') : require('../../assets/icons/uncheck.png')}
                                />

                            </View>
                        </TouchableOpacity>
                    }
                // contentContainerStyle={{ paddingBottom: 120 }}
                />
            </View>
            <View style={[{ marginTop: 20 }, !this.state.isEmployee ? { display: 'flex' } : { display: 'none' }]}>
                <FlatList
                    data={this.state.departmentList}
                    extraData={this.state}
                    keyExtractor={(item) => item.ID.toString()}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => this.EditDepartment(item.ID)}>
                            <View style={{ flexDirection: 'row', backgroundColor: '#FFF', height: 40, borderBottomColor: '#C3C3C3', borderBottomWidth: 1 }}>
                                <Text style={[{ lineHeight: 40, marginLeft: 16, flex: 1 }]}>
                                    {item.Ma} -  {item.Ten}
                                </Text>
                                <Image
                                    style={{ marginTop: 13, marginRight: 16, height: 14, width: 14 }}
                                    source={(this.state.filterTask.departmentList.indexOf(item.ID) > -1) ? require('../../assets/icons/check.png') : require('../../assets/icons/uncheck.png')}
                                />
                            </View>
                        </TouchableOpacity>
                    }
                // contentContainerStyle={{ paddingBottom: 120 }}
                />
            </View>
            <View style={{ flex: 1 }}>

            </View>
            <View style={{
                height: 54, flexDirection: 'row', backgroundColor: '#FFF'
            }}>
                <View style={{ flex: 1 }}>

                </View>
                <TouchableOpacity onPress={() => this.setState({ visibleModalEmployee: false })} style={{ flex: 1, flexDirection: 'row' }}>
                    <Image
                        style={{ marginTop: 16, marginLeft: 10, marginRight: 14, height: 25, width: 25 }}
                        source={require('../../assets/icons/close.png')}
                    />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 54, color: '#999999' }}>
                        HỦY
                </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ visibleModalEmployee: false })}>
                    <Text style={{ fontSize: 15, lineHeight: 54, color: '#0092FF', marginRight: 24, marginLeft: 16 }}>
                        Áp dụng
                </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    ChangeDateFilter(s, e) {
        this.state.filterTask.fromDate = s;
        this.state.filterTask.toDate = e;
        try {
            AsyncStorage.setItem('filterTask', JSON.stringify(this.state.filterTask));

        } catch (error) {
            console.log("Error saving data" + error);
        }
        this.setState({ filterTask: this.state.filterTask })
    }
    ChangeDateFilterSingle(type) {
        if (type == 'all') {
            this.state.filterTask.fromDate = '';
            this.state.filterTask.toDate = '';
        }
        if (type == 'yesterday') {
            this.state.filterTask.fromDate = this.state.yesterday;
            this.state.filterTask.toDate = this.state.yesterday;
        }
        if (type == 'today') {
            this.state.filterTask.fromDate = this.state.today;
            this.state.filterTask.toDate = this.state.today;
        }
        try {
            AsyncStorage.setItem('filterTask', JSON.stringify(this.state.filterTask));

        } catch (error) {
            console.log("Error saving data" + error);
        }
        this.renderModalEndDay();
        this.setState({ filterTask: this.state.filterTask, visibleModalEndTime: false });
    }
    renderModalEndDay = () => (
        <View style={styles.modalContent}>
            <View style={{
                height: 48, flexDirection: 'row', backgroundColor: '#EFF1F6', paddingLeft: 26,
                paddingRight: 26, borderTopStartRadius: 4, borderTopEndRadius: 4
            }}>
                <Text style={{ lineHeight: 48, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                    THỜI HẠN
                    </Text>
            </View>
            <View style={{ height: 80, flexDirection: 'row', marginTop: 13 }}>
                <View style={{ marginLeft: 24 }}>
                    <Text>
                        Từ ngày
                    </Text>
                    <Text style={{ fontWeight: 'bold' }}>
                        {this.state.filterTask.fromDate != '' ? moment(this.state.filterTask.fromDate).format('DD/MM/YYYY') : 'tất cả'}

                    </Text>
                </View>
                <View style={{ flex: 1 }}>

                </View>
                <View style={{ marginRight: 23 }}>
                    <Text>
                        Đến ngày
                    </Text>
                    <Text style={{ fontWeight: 'bold' }}>
                        {this.state.filterTask.toDate != '' ? moment(this.state.filterTask.toDate).format('DD/MM/YYYY') : 'tất cả'}

                    </Text>
                </View>
            </View>
            <View style={{ paddingLeft: 24, paddingRight: 24 }}>
                <DateRangePicker
                    refesh={this.state.filterTask.fromDate}
                    initialRange={[this.state.filterTask.fromDate, this.state.filterTask.toDate]}
                    onSuccess={(s, e) => this.ChangeDateFilter(s, e)}
                    theme={{ markColor: '#5A6276', markTextColor: 'white' }} />
                {/* <Calendar
                    style={{
                        paddingRight: 0,
                        paddingLeft: 0,
                        marginRight: 0,
                        marginLeft: 0
                    }}
                    onDayPress={this.onDaySelect.bind(this)}
                    markingType={"custom"}
                    markedDates={{
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
                /> */}
            </View>
            <View style={{ marginTop: 10, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => this.ChangeDateFilterSingle('all')} >
                    <Text style={[{ marginLeft: 24, height: 24, width: 80, borderRadius: 12, borderColor: '#5A6276', borderWidth: 1, textAlign: 'center', textAlignVertical: 'center' }, !this.state.filterTask.fromDate ? { backgroundColor: '#5A6276', color: '#FFF' } : {}]}>
                        Tất cả
                </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.ChangeDateFilterSingle('yesterday')} >
                    <Text style={[{ marginLeft: 24, height: 24, width: 80, borderRadius: 12, borderColor: '#5A6276', borderWidth: 1, textAlign: 'center', textAlignVertical: 'center' }, (this.state.filterTask.fromDate == this.state.filterTask.toDate && this.state.filterTask.fromDate == this.state.yesterday) ? { backgroundColor: '#5A6276', color: '#FFF' } : {}]}>
                        Hôm qua
                </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.ChangeDateFilterSingle('today')} >
                    <Text style={[{ marginLeft: 24, height: 24, width: 80, borderRadius: 12, borderColor: '#5A6276', borderWidth: 1, textAlign: 'center', textAlignVertical: 'center' }, (this.state.filterTask.fromDate == this.state.filterTask.toDate && this.state.filterTask.fromDate == this.state.today) ? { backgroundColor: '#5A6276', color: '#FFF' } : {}]}>
                        Hôm nay
                </Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', }}>
                <View style={{ flex: 1 }}></View>
                <TouchableOpacity onPress={() => this.setState({ visibleModalEndTime: false })}>
                    <Image
                        style={{ marginTop: 35, marginBottom: 22, marginRight: 50, height: 22, width: 73 }}
                        source={require('../../assets/icons/dong.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ visibleModalEndTime: false })}>
                    <Text
                        style={{ color: '#3498DB', marginTop: 37, marginBottom: 22, marginRight: 35 }}
                    >
                        ÁP DỤNG
                </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    onDaySelect(day) {
        console.log('date', day);
        this.setState({
            _markedDates: day.dateString
        });
    }
    ChangeStatus(ID) {

        if (!this.state.filterTask.statusList || this.state.filterTask.statusList.indexOf(ID) < 0) {
            this.state.filterTask.statusList.push(ID);
        } else {
            let index = this.state.filterTask.statusList.indexOf(ID)
            this.state.filterTask.statusList.splice(index, 1);
        }
        try {
            AsyncStorage.setItem('filterTask', JSON.stringify(this.state.filterTask));

        } catch (error) {
            console.log("Error saving data" + error);
        }
        this.setState({ filterTask: this.state.filterTask })
    }
    ChangePriority(ID) {

        if (!this.state.filterTask.priorityList || this.state.filterTask.priorityList.indexOf(ID) < 0) {
            this.state.filterTask.priorityList.push(ID);
        } else {
            let index = this.state.filterTask.priorityList.indexOf(ID)
            this.state.filterTask.priorityList.splice(index, 1);
        }
        try {
            AsyncStorage.setItem('filterTask', JSON.stringify(this.state.filterTask));

        } catch (error) {
            console.log("Error saving data" + error);
        }
        this.setState({ filterTask: this.state.filterTask })
    }
    ChangeTag(ID) {

        if (!this.state.filterTask.tagList || this.state.filterTask.tagList.indexOf(ID) < 0) {
            this.state.filterTask.tagList.push(ID);
        } else {
            let index = this.state.filterTask.tagList.indexOf(ID)
            this.state.filterTask.tagList.splice(index, 1);
        }
        try {
            AsyncStorage.setItem('filterTask', JSON.stringify(this.state.filterTask));

        } catch (error) {
            console.log("Error saving data" + error);
        }
        this.setState({ filterTask: this.state.filterTask })
    }
    render() {
        return (
            <View>
                <Modal
                    isVisible={this.state.visibleModalEmployee}
                    onBackdropPress={() => this.setState({ visibleModalEmployee: false })}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight">
                    {this.renderModalEmployee()}
                </Modal>
                <Modal
                    isVisible={this.state.visibleModalEndTime}
                    onBackdropPress={() => this.setState({ visibleModalEndTime: false })}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight">
                    {this.renderModalEndDay()}
                </Modal>
                <ScrollView>
                    <View style={[styles.shadow, { height: 54, flexDirection: 'row', backgroundColor: '#FFF' }]} >
                        <TouchableOpacity onPress={() => this.BackPage('close')}>
                            <Image
                                style={{ marginTop: 17, marginLeft: 10, marginRight: 14, height: 25, width: 25 }}
                                source={require('../../assets/icons/close.png')}
                            />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 54, flex: 1 }}>
                            Lọc công việc
                </Text>
                        <TouchableOpacity onPress={() => this.BackPage()}>
                            <Text style={{ fontSize: 15, lineHeight: 54, color: '#0092FF', marginRight: 16, marginLeft: 16 }}>
                                Áp dụng
                </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 50, flexDirection: 'row' }} >
                        <TouchableOpacity onPress={() => this.setState({})}>
                            <Image
                                style={{ marginTop: 18, marginLeft: 16, marginRight: 16, height: 16, width: 19 }}
                                source={require('../../assets/icons/taskStatus.png')}
                            />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 15, fontWeight: 'bold', lineHeight: 50 }}>
                            Trạng thái công việc hiển thị
                        </Text>
                    </View>
                    <FlatList
                        data={this.state.lstTrangThai}
                        extraData={this.state}
                        keyExtractor={(item) => item.ID.toString()}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.ChangeStatus(item.ID)}>
                                <View style={{ flexDirection: 'row', height: 40, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#C3C3C3' }}>
                                    <Text style={{ lineHeight: 40, paddingLeft: 16, color: item.Color, flex: 1 }}>
                                        {item.Name}
                                    </Text>
                                    <Image
                                        style={{ marginTop: 13, marginRight: 16, height: 14, width: 14 }}
                                        source={(!this.state.filterTask.statusList || this.state.filterTask.statusList.indexOf(item.ID) < 0) ? require('../../assets/icons/uncheck.png') : require('../../assets/icons/check.png')}
                                    />
                                </View>
                            </TouchableOpacity>
                        }
                        maxToRenderPerBatch={1}
                        windowSize={5}
                        onEndReachedThreshold={0.5}
                        removeClippedSubviews={true}
                        disableVirtualization={true}
                        maxToRenderPerBatch={1}
                        initialNumToRender={5}
                    // contentContainerStyle={{ paddingBottom: 120 }}
                    />

                    <View style={{ height: 50, flexDirection: 'row' }} >
                        <TouchableOpacity onPress={() => this.setState({})}>
                            <Image
                                style={{ marginTop: 16, marginLeft: 16, marginRight: 16, height: 20, width: 21 }}
                                source={require('../../assets/icons/UserEdit.png')}
                            />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 15, fontWeight: 'bold', lineHeight: 50 }}>
                            Nhân sự & bộ phận thực hiện
                        </Text>
                    </View>
                    <View style={{ height: 88, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text numberOfLines={2} style={{ marginLeft: 16, width: 55, marginRight: 38, marginTop: 11 }}>
                            Nhân sự
                            thực hiện
                    </Text>
                        <View style={{ flex: 1, marginTop: 11 }}>
                            <Text style={{ flex: 1, lineHeight: 22, height: 16 }}>
                                {this.state.employeeListStr != '' ? this.state.employeeListStr : 'chưa có'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => this.setState({ visibleModalEmployee: true, isEmployee: true })}>
                            <Text style={{ color: '#0092FF', marginRight: 16, marginLeft: 16, marginTop: 19 }}>thêm</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 88, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text numberOfLines={2} style={{ marginLeft: 16, width: 55, marginRight: 38, marginTop: 11 }}>
                            Bộ phận
                             thực hiện
                    </Text>
                        <View style={{ flex: 1, marginTop: 11 }}>
                            <Text style={{ flex: 1, lineHeight: 22, height: 16 }}>
                                {this.state.departmentListStr != '' ? this.state.departmentListStr : 'chưa có'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => this.setState({ visibleModalEmployee: true, isEmployee: false })}>
                            <Text style={{ color: '#0092FF', marginRight: 16, marginLeft: 16, marginTop: 19 }}>thêm</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 50, flexDirection: 'row' }} >
                        <TouchableOpacity onPress={() => this.setState({})}>
                            <Image
                                style={{ marginTop: 16, marginLeft: 16, marginRight: 16, height: 20, width: 20 }}
                                source={require('../../assets/icons/clock.png')}
                            />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 15, fontWeight: 'bold', lineHeight: 50 }}>
                            Thời hạn
                        </Text>
                    </View>
                    <View style={{ height: 40, backgroundColor: '#FFF', flexDirection: 'row' }}>
                        <Text style={{ color: '#999999', lineHeight: 40, marginLeft: 16 }}>
                            Từ ngày
                    </Text>
                        <TouchableOpacity onPress={() => this.setState({ visibleModalEndTime: true })}>
                            <Text style={{ color: '#0092FF', lineHeight: 40, marginLeft: 14 }}>
                                {this.state.filterTask.fromDate != '' ? moment(this.state.filterTask.fromDate).format('DD/MM/YYYY') : 'tất cả'}
                                {/* 19/10/2018 */}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>

                        </View>
                        <Text style={{ color: '#999999', lineHeight: 40, marginRight: 16 }}>
                            Đến ngày
                    </Text>
                        <Text style={{ color: '#0092FF', lineHeight: 40, marginRight: 16 }}>
                            {this.state.filterTask.toDate != '' ? moment(this.state.filterTask.toDate).format('DD/MM/YYYY') : 'tất cả'}
                            {/* 19/10/2018 */}
                        </Text>
                    </View>
                    <View style={{ height: 50, flexDirection: 'row' }} >
                        <TouchableOpacity onPress={() => this.setState({ visibleModalEndTime: true })}>
                            <CustomIcon name='flag' size={16} style={[{ marginTop: 18, marginLeft: 16, marginRight: 16, }]} />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 15, fontWeight: 'bold', lineHeight: 50 }}>
                            Mức độ ưu tiên
                        </Text>
                    </View>
                    <FlatList
                        data={this.state.lstDoUuTien}
                        extraData={this.state}
                        keyExtractor={(item) => item.ID.toString()}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.ChangePriority(item.ID)}>
                                <View style={{ flexDirection: 'row', height: 40, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#C3C3C3' }}>
                                    <Text style={{ lineHeight: 40, paddingLeft: 16, color: item.Color, flex: 1 }}>
                                        {item.Name}
                                    </Text>
                                    <Image
                                        style={{ marginTop: 13, marginRight: 16, height: 14, width: 14 }}
                                        source={(!this.state.filterTask.priorityList || this.state.filterTask.priorityList.indexOf(item.ID) < 0) ? require('../../assets/icons/uncheck.png') : require('../../assets/icons/check.png')}
                                    />

                                </View>
                            </TouchableOpacity>
                        }
                        maxToRenderPerBatch={1}
                        windowSize={5}
                        onEndReachedThreshold={0.5}
                        removeClippedSubviews={true}
                        disableVirtualization={true}
                        maxToRenderPerBatch={1}
                        initialNumToRender={5}
                    // contentContainerStyle={{ paddingBottom: 120 }}
                    />
                    <View style={{ height: 50, flexDirection: 'row' }} >
                        <TouchableOpacity onPress={() => this.setState({})}>
                            <CustomIcon name='Tag' size={20} style={[{ marginTop: 16, marginLeft: 16, marginRight: 16, }]} />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 15, fontWeight: 'bold', lineHeight: 50 }}>
                            Tag công việc
                        </Text>
                    </View>
                    <FlatList
                        data={this.state.lstTag}
                        extraData={this.state}
                        keyExtractor={(item) => item.ID.toString()}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.ChangeTag(item.ID)}>
                                <View style={{ flexDirection: 'row', height: 40, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#C3C3C3' }}>
                                    {/* <View style={{ flex: 1 }}>
                                        <Text style={{ lineHeight: 40, paddingLeft: 16, color: '#FFF', backgroundColor: item.Color, }}>
                                            {item.Name}
                                        </Text>
                                    </View> */}
                                    <View style={{ marginLeft: 16, marginTop: 13, paddingLeft: 5, paddingRight: 5, marginRight: 14, height: 18, backgroundColor: item.Color, borderRadius: 8, alignItems: 'center' }}>
                                        <Text style={{ color: '#FFF', lineHeight: 18 }}>{item.Name}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>

                                    </View>
                                    <Image
                                        style={{ marginTop: 13, marginRight: 16, height: 14, width: 14 }}
                                        source={(!this.state.filterTask.tagList || this.state.filterTask.tagList.indexOf(item.ID) < 0) ? require('../../assets/icons/uncheck.png') : require('../../assets/icons/check.png')}
                                    />

                                </View>
                            </TouchableOpacity>
                        }
                        maxToRenderPerBatch={1}
                        windowSize={5}
                        onEndReachedThreshold={0.5}
                        removeClippedSubviews={true}
                        disableVirtualization={true}
                        maxToRenderPerBatch={1}
                        initialNumToRender={5}
                    // contentContainerStyle={{ paddingBottom: 120 }}
                    />
                </ScrollView>
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
    scene: {
        height: Dimensions.get('window').height - 200,
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
    searchBox: {
        //Its for IOS
        shadowColor: 'rgba(0, 0, 0, 0.16)',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.2,
        // its for android
        elevation: 5,
        position: 'relative',
        flexDirection: 'row',
        backgroundColor: '#FFF',
        height: 40,
        margin: 16,
        borderRadius: 3,
        flexDirection: 'row'
    },
})
export default TaskFilter;

