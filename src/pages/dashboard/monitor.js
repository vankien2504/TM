import React, { Component } from 'react';
import { TouchableOpacity, ScrollView, AsyncStorage, Image, StyleSheet, View, Text, Dimensions, FlatList } from 'react-native';
import { BarChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import StackedBarChart from "../../share/customize/svg-chart/stacked-bar-chart";
import { Text as SvgText } from 'react-native-svg';
import * as scale from 'd3-scale'
import YAxisCustomize from "../../share/customize/y-axis-customize";
import CheckboxModest from 'react-native-modest-checkbox';
import TaskService from "../../share/services/task.service";
const GLOBAL = require('../../share/global.js');
import moment from 'moment';
import Modal from "react-native-modal";
import DateRangePicker from '../task/DateRangePicker';
import SearchBar from 'react-native-material-design-searchbar';
import { hasValue, cloneObject } from '../../share/services/ultility';
class Monitor extends Component {
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
            filterDashboard: {},
            lstTrangThai: GLOBAL.lstTrangThai,
            tasklst: [],
            chart1Data: [],
            chart2Data: [],
            chart2DataStand: [],
            keylst: [],
            colorlst: [],

            visibleModalEmployee: false,

            employeeListStr: '',
            departmentListStr: '',

            employeeListStand: [],
            employeeList: [],

            departmentList: [],
            departmentListStand: [],

            isEmployee: true,
        };
    }
    componentWillMount() {
        GLOBAL.lstTrangThai.forEach(element => {

            this.state.keylst.push(element.Name);
            this.state.colorlst.push(element.Color);

            let objTemp = {
                value: 0,
                enable: true,
                ID: element.ID,
                label: element.Name,
                Color: element.Color,
                svg: {
                    fill: element.Color,
                },
            }
            this.state.chart1Data.push(objTemp);
        });
        for (i = 0; i < this.state.lstTrangThai.length; i++) {
            this.state.lstTrangThai[i].enable = true;
        }
        // this.setState({ keylst: this.state.keylst });

        // let param = { "IDCongViec": 0, "EditItem": { "Page": 1, "PageSize": 50, "Filter": "", "Sort": "" }, excludeList: [], "includeList": [] }
        this.FilterDashboard();
        this.EmployeeList();
        this.DepartmentList();
    }

    EditEmployee(ID) {
        let valueIndex = this.state.filterDashboard.employeeList.indexOf(ID);
        if (valueIndex > -1) {
            this.state.filterDashboard.employeeList.splice(valueIndex, 1);
        } else {
            this.state.filterDashboard.employeeList.push(ID);
        }
        try {
            AsyncStorage.setItem('filterDashboard', JSON.stringify(this.state.filterDashboard));

        } catch (error) {
            console.log("Error saving data" + error);
        }
        this.state.employeeListStr = '';
        for (j = 0; j < this.state.employeeList.length; j++) {
            for (i = 0; i < this.state.filterDashboard.employeeList.length; i++) {
                if (this.state.filterDashboard.employeeList[i] == this.state.employeeList[j].ID) {
                    if (this.state.employeeList.indexOf(this.state.employeeList[j].Ma) < 0) {
                        this.state.employeeListStr = this.state.employeeListStr + this.state.employeeList[j].Ma + ' - ' + this.state.employeeList[j].Ten + "\n";
                    }
                }
            }
        }
        this.FilterDashboard();
        this.setState({ filterDashboard: this.state.filterDashboard })
    }
    EditDepartment(ID) {

        let valueIndex = this.state.filterDashboard.departmentList.indexOf(ID);
        if (valueIndex > -1) {
            this.state.filterDashboard.departmentList.splice(valueIndex, 1);
        } else {
            this.state.filterDashboard.departmentList.push(ID);
        }
        try {
            AsyncStorage.setItem('filterDashboard', JSON.stringify(this.state.filterDashboard));

        } catch (error) {
            console.log("Error saving data" + error);
        }
        this.state.departmentListStr = '';
        for (j = 0; j < this.state.departmentList.length; j++) {
            for (i = 0; i < this.state.filterDashboard.departmentList.length; i++) {
                if (this.state.filterDashboard.departmentList[i] == this.state.departmentList[j].ID) {
                    if (this.state.departmentList.indexOf(this.state.departmentList[j].Ma) < 0) {
                        this.state.departmentListStr = this.state.departmentListStr + this.state.departmentList[j].Ma + ' - ' + this.state.departmentList[j].Ten + "\n";
                    }
                }
            }
        }
        this.FilterDashboard();
        this.setState({ filterDashboard: this.state.filterDashboard });
    }
    EmployeeList() {
        let param = { "IDCongViec": 0, "EditItem": { "Page": 1, "PageSize": 50, "Filter": "", "Sort": "" }, excludeList: [], "includeList": [] }
        TaskService.LayDanhSachNhanSuKhongTheoCoCau(param).then((res) => {
            let employeeObject = JSON.parse(res);
            for (j = 0; j < employeeObject.Data.length; j++) {
                for (i = 0; i < this.state.filterDashboard.employeeList.length; i++) {
                    if (this.state.filterDashboard.employeeList[i] == employeeObject.Data[j].ID) {

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
                for (i = 0; i < this.state.filterDashboard.departmentList.length; i++) {
                    if (this.state.filterDashboard.departmentList[i] == departmentObject.Data[j].ID) {
                        this.state.departmentListStr = this.state.departmentListStr + departmentObject.Data[j].Ma + ' - ' + departmentObject.Data[j].Ten + "\n";
                    }
                }
            }
            this.setState({ departmentList: departmentObject.Data, departmentListStand: departmentObject.Data, departmentListStr: this.state.departmentListStr })
        });
    }
    FilterDashboard() {
        AsyncStorage.getItem('filterDashboard').then((res, error) => {
            if (res) {
                let filterDashboardObject = JSON.parse(res)

                this.setState({
                    filterDashboard: filterDashboardObject
                });
            } else {
                let filterDashboard = {
                    employeeList: [],
                    departmentList: [],
                    fromDate: '',
                    toDate: '',
                    statusList: [],
                    priorityList: [],
                    tagList: []
                }
                this.setState({
                    filterDashboard: filterDashboard
                });
                try {
                    AsyncStorage.setItem('filterDashboard', JSON.stringify(filterDashboard));
                } catch (error) {
                    console.log("Error saving data" + error);
                }
            }
        });

        AsyncStorage.getItem('task').then((res, error) => {
            if (res) {
                let taskObject = JSON.parse(res)
                let taskArr = [];
                AsyncStorage.getItem('filterDashboard').then((res, error) => {
                    if (res) {
                        let today = new Date();
                        let date2 = new Date(new Date().setDate(today.getDate() - 30));
                        let dateStart = moment(date2).format('YYYY-MM-DDT00-00-01');
                        let dateEnd = moment(today).format('YYYY-MM-DDT23-59-59');
                        let paramchart2 = { "FilterTrangThai": [1, 2, 3, 4, 5, 6, 7, 8], "Filter": { "Filter": [], "FromDate": today, "Page": 1, "PageSize": 50, "PriorityID": 0, "SearchString": "", "ToDate": date2, "TotalSizeObj": 0, "TotalSizeTask": 0 } }
                        let filterDashboardObject = JSON.parse(res)
                        if (filterDashboardObject.departmentList && filterDashboardObject.departmentList.length > 0) {
                            for (i = 0; i < taskObject.length; i++) {
                                filterDashboardObject.departmentList.forEach(element => {
                                    paramchart2.Filter.Filter.push({ ID: element, IsStaff: false })
                                });
                                taskObject[i].ListTask.Data = taskObject[i].ListTask.Data.filter(f => {
                                    return !(!f.IDDonVi || filterDashboardObject.departmentList.indexOf(f.IDDonVi) < 0)
                                });
                            }
                        }
                        if (filterDashboardObject.employeeList && filterDashboardObject.employeeList.length > 0) {
                            for (i = 0; i < taskObject.length; i++) {
                                filterDashboardObject.employeeList.forEach(element => {
                                    paramchart2.Filter.Filter.push({ ID: element, IsStaff: true })
                                });
                                taskObject[i].ListTask.Data = taskObject[i].ListTask.Data.filter(f => {
                                    return !(!f.IDNhanSuThucHienChinh || filterDashboardObject.employeeList.indexOf(f.IDNhanSuThucHienChinh) < 0)
                                });
                            }
                        }
                        if (filterDashboardObject.statusList && filterDashboardObject.statusList.length > 0) {
                            for (i = 0; i < taskObject.length; i++) {
                                taskObject[i].ListTask.Data = taskObject[i].ListTask.Data.filter(f => {
                                    return !(!f.IDTrangThai || filterDashboardObject.statusList.indexOf(f.IDTrangThai) < 0)
                                });
                            }
                        }
                        if (filterDashboardObject.priorityList && filterDashboardObject.priorityList.length > 0) {
                            for (i = 0; i < taskObject.length; i++) {
                                taskObject[i].ListTask.Data = taskObject[i].ListTask.Data.filter(f => {
                                    return !(!f.IDUuTien || filterDashboardObject.priorityList.indexOf(f.IDUuTien) < 0)
                                });
                            }
                        }
                        if (filterDashboardObject.tagList && filterDashboardObject.tagList.length > 0) {

                            for (i = 0; i < taskObject.length; i++) {
                                taskObject[i].ListTask.Data = taskObject[i].ListTask.Data.filter(f => {
                                    return !(!f.lstNhan || !this.FindArrayInArray(f.lstNhan, filterDashboardObject.tagList))
                                });
                            }
                        }
                        if (filterDashboardObject.fromDate && filterDashboardObject.toDate) {
                            debugger
                            for (i = 0; i < taskObject.length; i++) {
                                taskObject[i].ListTask.Data = taskObject[i].ListTask.Data.filter(f => {
                                    return !(!f.KetThucEst || !(moment(f.KetThucEst).format('YYYY-MM-DD') >= moment(filterDashboardObject.fromDate).format('YYYY-MM-DD') && moment(f.KetThucEst).format('YYYY-MM-DD') <= moment(filterDashboardObject.toDate).format('YYYY-MM-DD')))
                                });
                            }
                        }
                        for (i = 0; i < this.state.chart1Data.length; i++) {
                            this.state.chart1Data[i].value = 0;
                        }
                        for (i = 0; i < this.state.chart2Data.length; i++) {
                            this.state.chart2Data[i].value = 0;
                        }
                        taskObject.forEach(element => {
                            element.ListTask.Data.forEach(element1 => {
                                taskArr.push(element1);
                                for (i = 0; i < this.state.chart1Data.length; i++) {
                                    if (this.state.chart1Data[i].ID == element1.IDTrangThai && element1.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
                                        this.state.chart1Data[i].value++;
                                    }
                                }

                            });
                        });
                        this.setState({
                            tasklst: taskArr,
                            chart1Data: this.state.chart1Data
                        });
                        this.state.chart2Data = [];
                        debugger
                        TaskService.DashboardStaffStatusChart(paramchart2).then((res) => {
                            let chart2Object = JSON.parse(res);
                            chart2Object.forEach(element => {

                                let objTemp = {
                                    value: 0,
                                    enable: true,
                                    ID: element.ID,
                                    label: element.Code,
                                    svg: {
                                        fill: '#5D5D5D',
                                    },
                                }
                                let objTemp1 = {
                                    value: 0,
                                    enable: true,
                                    ID: '-1',
                                    label: element.ItemName,
                                    svg: {
                                        fill: '#5D5D5D',
                                    },
                                }

                                let flag = false;
                                element.Childs.forEach(element1 => {
                                    if (element1.ID == -1) {
                                        if (this.state.keylst.indexOf(element1.ItemName) < 0) {
                                            this.state.keylst.push(element1.ItemName);
                                        }
                                        if (this.state.colorlst.indexOf(element1.Color) < 0) {
                                            this.state.colorlst.push(element1.Color);
                                        }
                                    }
                                })
                                this.state.keylst.forEach(element5 => {
                                    objTemp[element5] = 0;
                                    objTemp1[element5] = 0;
                                    element.Childs.forEach(element1 => {
                                        if (element5 == element1.ItemName && element1.ID != -1) {
                                            objTemp[element1.ItemName] = element1.Quantity;
                                            objTemp.value = objTemp.value + element1.Quantity;
                                        }
                                        if (element1.ID == -1) {
                                            flag = true;
                                            objTemp1['ID'] = element1.ItemName + element.ItemName;
                                            objTemp1[element1.ItemName] = element1.Quantity;
                                        }
                                    });
                                });

                                this.state.chart2Data.push(objTemp);
                                this.state.chart2Data.push(objTemp1);
                            });
                            debugger
                            // if (this.state.chart2DataStand.length == 0) {
                            //     this.setState({ chart2DataStand: this.state.chart2Data });
                            // }
                            let chart2DataStand = cloneObject(this.state.chart2Data);
                            this.setState({ chart2Data: this.state.chart2Data, chart2DataStand: chart2DataStand });

                        });
                    }

                });

            } else {

            }
        });
    }
    ChangeDataChart1(item) {
        for (i = 0; i < this.state.chart1Data.length; i++) {
            if (this.state.chart1Data[i].ID == item.ID) {
                this.state.chart1Data[i].enable = !this.state.chart1Data[i].enable;
            }
        }
        this.setState({
            chart1Data: this.state.chart1Data
        });
    }
    ChangeDataChart2(item, index) {
        // let chart2DataStand = cloneObject(this.state.chart2DataStand);
        // let chart2Data = cloneObject(this.state.chart2Data);
        if (!this.state.lstTrangThai[index].enable || this.state.lstTrangThai[index].enable == false) {
            this.state.lstTrangThai[index].enable = true;

            for (i = 0; i < this.state.chart2Data.length; i++) {
                this.state.chart2Data[i][item.Name] = this.state.chart2DataStand[i][item.Name];
            }
        } else {
            this.state.lstTrangThai[index].enable = false;
            for (i = 0; i < this.state.chart2Data.length; i++) {
                this.state.chart2Data[i][item.Name] = 0;
            }
        }


        this.setState({
            chart2Data: this.state.chart2Data,
            lstTrangThai: this.state.lstTrangThai
        });
    }
    ChangeDateFilter(s, e) {
        this.state.filterDashboard.fromDate = s;
        this.state.filterDashboard.toDate = e;
        try {
            AsyncStorage.setItem('filterDashboard', JSON.stringify(this.state.filterDashboard));

        } catch (error) {
            console.log("Error saving data" + error);
        }
        this.FilterDashboard();
        this.setState({ filterDashboard: this.state.filterDashboard, })
    }
    ChangeDateFilterSingle(type) {
        if (type == 'all') {
            this.state.filterDashboard.fromDate = '';
            this.state.filterDashboard.toDate = '';
        }
        if (type == 'yesterday') {
            this.state.filterDashboard.fromDate = this.state.yesterday;
            this.state.filterDashboard.toDate = this.state.yesterday;
        }
        if (type == 'today') {
            this.state.filterDashboard.fromDate = this.state.today;
            this.state.filterDashboard.toDate = this.state.today;
        }
        try {
            AsyncStorage.setItem('filterDashboard', JSON.stringify(this.state.filterDashboard));

        } catch (error) {
            console.log("Error saving data" + error);
        }
        this.FilterDashboard();
        this.setState({ filterDashboard: this.state.filterDashboard, visibleModalEndTime: false });
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
                                    source={(this.state.filterDashboard.employeeList.indexOf(item.ID) > -1) ? require('../../assets/icons/check.png') : require('../../assets/icons/uncheck.png')}
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
                                    source={(this.state.filterDashboard.departmentList.indexOf(item.ID) > -1) ? require('../../assets/icons/check.png') : require('../../assets/icons/uncheck.png')}
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
                        {this.state.filterDashboard.fromDate != '' ? moment(this.state.filterDashboard.fromDate).format('DD/MM/YYYY') : 'tất cả'}

                    </Text>
                </View>
                <View style={{ flex: 1 }}>

                </View>
                <View style={{ marginRight: 23 }}>
                    <Text>
                        Đến ngày
                    </Text>
                    <Text style={{ fontWeight: 'bold' }}>
                        {this.state.filterDashboard.toDate != '' ? moment(this.state.filterDashboard.toDate).format('DD/MM/YYYY') : 'tất cả'}

                    </Text>
                </View>
            </View>
            <View style={{ paddingLeft: 24, paddingRight: 24 }}>
                <DateRangePicker
                    refesh={this.state.filterDashboard.fromDate}
                    initialRange={[this.state.filterDashboard.fromDate, this.state.filterDashboard.toDate]}
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
                    <Text style={[{ marginLeft: 24, height: 24, width: 80, borderRadius: 12, borderColor: '#5A6276', borderWidth: 1, textAlign: 'center', textAlignVertical: 'center' }, !this.state.filterDashboard.fromDate ? { backgroundColor: '#5A6276', color: '#FFF' } : {}]}>
                        Tất cả
                </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.ChangeDateFilterSingle('yesterday')} >
                    <Text style={[{ marginLeft: 24, height: 24, width: 80, borderRadius: 12, borderColor: '#5A6276', borderWidth: 1, textAlign: 'center', textAlignVertical: 'center' }, (this.state.filterDashboard.fromDate == this.state.filterDashboard.toDate && this.state.filterDashboard.fromDate == this.state.yesterday) ? { backgroundColor: '#5A6276', color: '#FFF' } : {}]}>
                        Hôm qua
                </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.ChangeDateFilterSingle('today')} >
                    <Text style={[{ marginLeft: 24, height: 24, width: 80, borderRadius: 12, borderColor: '#5A6276', borderWidth: 1, textAlign: 'center', textAlignVertical: 'center' }, (this.state.filterDashboard.fromDate == this.state.filterDashboard.toDate && this.state.filterDashboard.fromDate == this.state.today) ? { backgroundColor: '#5A6276', color: '#FFF' } : {}]}>
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
    render() {
        const data = [];
        const data2 = [];
        const data3 = [
            {
                enable: true,
                ID: '2',
                label: 'abc',
                svg: {
                    fill: '#7b4173',
                },
                apples: 3840,
                bananas: 1920,
                cherries: 960,
                dates: 400,
                oranges: 400,
            },
            {
                ID: '3',
                label: 'abc1',
                svg: {
                    fill: '#7b4173',
                },
                apples: 1600,
                bananas: 1440,
                cherries: 960,
                dates: 400,
            },
            {
                ID: '4',
                label: 'abc2',
                svg: {
                    fill: '#7b4173',
                },
                apples: 640,
                bananas: 960,
                cherries: 3640,
                dates: 400,
            },
            {
                ID: '5',
                label: 'abc3',
                svg: {
                    fill: '#7b4173',
                },
                apples: 3320,
                bananas: 480,
                cherries: 640,
                dates: 400,
            },
        ]
        this.state.chart1Data.forEach(element => {
            if (element.enable && element.label != 'Hủy') {
                data.push(element);
            }
        });
        this.state.chart2Data.forEach(element => {
            if (element.enable) {
                data2.push(element);
            }
        });
        const CUT_OFF = 1

        const colors = this.state.colorlst
        const keys = this.state.keylst
        const Labels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <SvgText
                    key={index}
                    x={value.value > CUT_OFF ? x(value.value) / 2 : x(value.value) + 10}
                    y={y(index) + (bandwidth / 2)}
                    fontSize={14}
                    fontWeight={'bold'}
                    fill={value.value > CUT_OFF ? 'white' : 'black'}
                    alignmentBaseline={'middle'}
                >
                    {value.value}
                </SvgText>
            ))
        )
        const Labels2 = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <SvgText
                    key={index}
                    x={value.value > CUT_OFF ? x(value.value) / 2 : x(value.value) + 10}
                    y={y(index) + (bandwidth / 2)}
                    fontSize={14}
                    fontWeight={'bold'}
                    fill={value.value > CUT_OFF ? 'white' : 'black'}
                    alignmentBaseline={'middle'}
                >
                    {value.value}
                </SvgText>
            ))
        )
        const LabelsBottom = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <SvgText
                    key={index}
                    x={value.value > CUT_OFF ? x(value.value) / 2 : x(value.value) + 10}
                    y={y(index) + (bandwidth / 2) + 10}
                    fontSize={14}
                    fontWeight={'bold'}
                    fill={value.value > CUT_OFF ? 'green' : 'black'}
                    alignmentBaseline={'middle'}
                >
                    {value.value}
                </SvgText>
            ))
        )
        const axesSvg = { fontSize: 10, fill: 'red' };
        const verticalContentInset = { top: 10, bottom: 10 }
        const xAxisHeight = 30
        return (
            <View style={{ flex: 1 }}>
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
                    <View style={[{ marginTop: 17, height: 40, backgroundColor: '#FFF', flexDirection: 'row' }]}>
                        <Text style={{ color: '#999999', lineHeight: 40, marginLeft: 16 }}>
                            Thời gian
                    </Text>
                        <Text style={{ color: '#999999', lineHeight: 40, marginLeft: 24 }}>
                            Từ
                    </Text>
                        <TouchableOpacity onPress={() => this.setState({ visibleModalEndTime: true })}>
                            <Text style={{ color: '#0092FF', lineHeight: 40, marginLeft: 14 }}>
                                {this.state.filterDashboard.fromDate != '' ? moment(this.state.filterDashboard.fromDate).format('DD/MM/YYYY') : 'tất cả'}
                                {/* 19/10/2018 */}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>

                        </View>
                        <Text style={{ color: '#999999', lineHeight: 40, marginRight: 16 }}>
                            Đến
                    </Text>
                        <TouchableOpacity onPress={() => this.setState({ visibleModalEndTime: true })}>
                            <Text style={{ color: '#0092FF', lineHeight: 40, marginRight: 16 }}>
                                {this.state.filterDashboard.toDate != '' ? moment(this.state.filterDashboard.toDate).format('DD/MM/YYYY') : 'tất cả'}
                                {/* 19/10/2018 */}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 88, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }}>
                        <Text numberOfLines={2} style={{ marginLeft: 16, width: 55, marginRight: 38, marginTop: 11 }}>
                            Nhân sự
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
                    <View style={{ flex: 1, backgroundColor: '#FFF', }}>
                        <Text style={{ backgroundColor: '#EDEFF3', paddingLeft: 24, height: 48, lineHeight: 48, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            Tình trạng công việc
                    </Text>
                        <View style={{ flexDirection: 'row', height: 350, paddingLeft: 16, paddingRight: 16 }}>
                            <YAxisCustomize
                                data={data}
                                yAccessor={({ index }) => index}
                                scale={scale.scaleBand}
                                contentInset={{ top: 10, bottom: 10 }}
                                spacing={0.2}
                                formatLabel={(index) => data[index].label}
                            // svg={({ index }) => index}
                            // svg={{ fill: data[1].svg.fill }}
                            />

                            <View style={{ flex: 1, height: 385 }}>
                                <BarChart
                                    style={{ flex: 1, }}
                                    data={data}
                                    horizontal={true}
                                    yAccessor={({ item }) => item.value}
                                    // svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                                    contentInset={{ top: 10, bottom: 10 }}
                                    spacing={0.2}
                                    gridMin={0}
                                >
                                    <Labels />
                                    {/* <LabelsBottom /> */}
                                    {/* <Grid direction={Grid.Direction.HORIZONTAL} /> */}
                                    <Grid direction={Grid.Direction.VERTICAL} />
                                </BarChart>
                                <XAxis
                                    style={{ height: xAxisHeight, marginTop: 5, marginHorizontal: -10 }}
                                    data={data}
                                    min={1}
                                    numberOfTicks={2}
                                    xAccessor={({ index }) => data[index].value}
                                    contentInset={{ left: 50, right: 10 }}
                                    svg={axesSvg}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 46, height: 100, paddingLeft: 24, paddingRight: 24, }}>
                            <FlatList
                                data={this.state.chart1Data}
                                numColumns={3}
                                extrasData={this.state}
                                keyExtractor={(item) => item.ID.toString()}
                                renderItem={({ item }) =>
                                    <View style={[{
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }, item.label == 'Hủy' ? { display: 'none' } : { display: 'flex' }]}>
                                        <CheckboxModest
                                            checked={item.enable}
                                            label={item.label}
                                            labelStyle={[{ fontSize: 15, fontWeight: 'bold', color: item.Color, width: 80 }]}
                                            checkedComponent={<Image
                                                style={{ height: 14, width: 14 }}
                                                source={require('../../assets/icons/check.png')} />}
                                            uncheckedComponent={<Image
                                                style={{ height: 14, width: 14, marginTop: 2 }}
                                                source={require('../../assets/icons/uncheck.png')} />}
                                            onChange={() => this.ChangeDataChart1(item)}
                                        />
                                    </View>
                                }
                                maxToRenderPerBatch={1}
                                windowSize={5}
                                onEndReachedThreshold={0.5}
                                removeClippedSubviews={true}
                                disableVirtualization={true}
                                maxToRenderPerBatch={1}
                                initialNumToRender={10}
                            />

                        </View>
                    </View >
                    <View style={{ flex: 1, backgroundColor: '#FFF', }}>
                        <Text style={{ backgroundColor: '#EDEFF3', paddingLeft: 24, height: 48, lineHeight: 48, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            Tình trạng công việc từng nhân sự
                    </Text>
                        <View style={{ flexDirection: 'row', height: 350, paddingLeft: 16, paddingRight: 16 }}>
                            <YAxisCustomize
                                data={data2}
                                yAccessor={({ index }) => index}
                                scale={scale.scaleBand}
                                contentInset={{ top: 10, bottom: 10 }}
                                spacing={0.2}
                                formatLabel={(index) => data2[index].label}
                            // svg={({ index }) => index}
                            // svg={{ fill: data[1].svg.fill }}
                            />

                            <View style={{ flex: 1, height: 385 }}>
                                <StackedBarChart
                                    style={{ flex: 1, }}
                                    keys={keys}
                                    colors={colors}
                                    data={data2}
                                    showGrid={true}
                                    horizontal={true}
                                    contentInset={{ top: 10, bottom: 10 }}

                                >
                                    <Labels />
                                    <Grid direction={Grid.Direction.VERTICAL} />
                                </StackedBarChart>
                                {/* <BarChart
                                    style={{ flex: 1, }}
                                    data={data2}
                                    horizontal={true}
                                    yAccessor={({ item }) => item.value}
                                    // svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                                    contentInset={{ top: 10, bottom: 10 }}
                                    spacing={0.2}
                                    gridMin={0}
                                >
                                    <Labels2 />
                                    <Grid direction={Grid.Direction.VERTICAL} />
                                </BarChart> */}
                                <XAxis
                                    style={{ height: xAxisHeight, marginTop: 5, marginHorizontal: -10 }}
                                    data={data2}
                                    min={1}
                                    numberOfTicks={2}
                                    xAccessor={({ index }) => data2[index].value}
                                    contentInset={{ left: 50, right: 10 }}
                                // svg={axesSvg}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 46, height: 100, paddingLeft: 24, paddingRight: 24, marginBottom: 100 }}>
                            <FlatList
                                data={this.state.lstTrangThai}
                                numColumns={3}
                                extrasData={this.state}
                                keyExtractor={(item) => item.ID.toString()}
                                renderItem={({ item, index }) =>
                                    <View style={[{
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }]}>
                                        <CheckboxModest
                                            checked={item.enable}
                                            label={item.Name}
                                            labelStyle={[{ fontSize: 15, fontWeight: 'bold', color: item.Color, width: 80 }]}
                                            checkedComponent={<Image
                                                style={{ height: 14, width: 14 }}
                                                source={require('../../assets/icons/check.png')} />}
                                            uncheckedComponent={<Image
                                                style={{ height: 14, width: 14, marginTop: 2 }}
                                                source={require('../../assets/icons/uncheck.png')} />}
                                            onChange={() => this.ChangeDataChart2(item, index)}
                                        />
                                    </View>
                                }
                                maxToRenderPerBatch={1}
                                windowSize={5}
                                onEndReachedThreshold={0.5}
                                removeClippedSubviews={true}
                                disableVirtualization={true}
                                maxToRenderPerBatch={1}
                                initialNumToRender={10}
                            />

                        </View>
                    </View >
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
        backgroundColor: "#FFF",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
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
});
export default Monitor;
