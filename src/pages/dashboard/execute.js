import React, { Component } from 'react';
import { TouchableOpacity, ScrollView, AsyncStorage, Image, StyleSheet, View, Text, Dimensions, FlatList } from 'react-native';
import { BarChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import { Text as SvgText } from 'react-native-svg';
import * as scale from 'd3-scale'
import YAxisCustomize from "../../share/customize/y-axis-customize";
import CheckboxModest from 'react-native-modest-checkbox';
const GLOBAL = require('../../share/global.js');
import moment from 'moment';
import Modal from "react-native-modal";
import DateRangePicker from '../task/DateRangePicker';
class Execute extends Component {
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
            tasklst: [],
            chart1Data: [],
            chart2Data: [],
            filterDashboard: {},
            visibleModalEndTime: false
        };
    }
    componentWillMount() {
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

        GLOBAL.lstTrangThai.forEach(element => {
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
        GLOBAL.lstDoUuTien.forEach(element => {
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
            this.state.chart2Data.push(objTemp);
        });
        this.FilterDashboard();

    }
    FilterDashboard() {
        AsyncStorage.getItem('task').then((res, error) => {
            if (res) {
                let taskObject = JSON.parse(res)
                let taskArr = [];
                AsyncStorage.getItem('filterDashboard').then((res, error) => {
                    if (res) {
                        let filterDashboardObject = JSON.parse(res)
                        if (filterDashboardObject.departmentList && filterDashboardObject.departmentList.length > 0) {
                            for (i = 0; i < taskObject.length; i++) {

                                taskObject[i].ListTask.Data = taskObject[i].ListTask.Data.filter(f => {
                                    return !(!f.IDDonVi || filterDashboardObject.departmentList.indexOf(f.IDDonVi) < 0)
                                });
                            }
                        }
                        if (filterDashboardObject.employeeList && filterDashboardObject.employeeList.length > 0) {
                            for (i = 0; i < taskObject.length; i++) {

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
                                    if (this.state.chart1Data[i].ID == element1.IDTrangThai && element1.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
                                        this.state.chart1Data[i].value++;
                                    }
                                }
                                for (i = 0; i < this.state.chart2Data.length; i++) {
                                    if (this.state.chart2Data[i].ID == element1.IDUuTien && element1.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
                                        this.state.chart2Data[i].value++;
                                    }
                                }

                            });
                        });
                        this.setState({
                            tasklst: taskArr,
                            chart1Data: this.state.chart1Data,
                            chart2Data: this.state.chart2Data
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
    ChangeDataChart2(item) {
        for (i = 0; i < this.state.chart2Data.length; i++) {
            if (this.state.chart2Data[i].ID == item.ID) {
                this.state.chart2Data[i].enable = !this.state.chart2Data[i].enable;
            }
        }
        this.setState({
            chart2Data: this.state.chart2Data
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
        const Labels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <SvgText
                    key={index}
                    x={value.value > CUT_OFF ? x(value.value) / 2 - 3 : x(value.value) + 10}
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
                    x={value.value > CUT_OFF ? x(value.value) / 2 - 3 : x(value.value) + 10}
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
                    isVisible={this.state.visibleModalEndTime}
                    onBackdropPress={() => this.setState({ visibleModalEndTime: false })}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight">
                    {this.renderModalEndDay()}
                </Modal>
                <ScrollView>
                    <View style={[styles.shadow, { marginTop: 17, height: 40, backgroundColor: '#FFF', flexDirection: 'row' }]}>
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
                            Phân bổ công việc theo mức ưu tiên
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
                                <BarChart
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
                                    {/* <LabelsBottom /> */}
                                    {/* <Grid direction={Grid.Direction.HORIZONTAL} /> */}
                                    <Grid direction={Grid.Direction.VERTICAL} />
                                </BarChart>
                                <XAxis
                                    style={{ height: xAxisHeight, marginTop: 5, marginHorizontal: -10 }}
                                    data={data2}
                                    min={1}
                                    numberOfTicks={2}
                                    xAccessor={({ index }) => data2[index].value}
                                    contentInset={{ left: 50, right: 10 }}
                                    svg={axesSvg}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 46, height: 100, paddingLeft: 24, paddingRight: 24, marginBottom: 100 }}>
                            <FlatList
                                data={this.state.chart2Data}
                                numColumns={3}
                                extrasData={this.state}
                                keyExtractor={(item) => item.ID.toString()}
                                renderItem={({ item }) =>
                                    <View style={[{
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }]}>
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
                                            onChange={() => this.ChangeDataChart2(item)}
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
});
export default Execute;
