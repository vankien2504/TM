import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    AsyncStorage
} from 'react-native';
// import { Agenda } from 'react-native-calendars';
import { Agenda } from '../../share/customize/react-native-calendars';
import CustomIcon from '../../share/customize/iconCustomize/CustomIcon.js'
import moment from "moment";
import 'moment/min/locales'
import { capitalizeFirstLetter } from '../../share/services/ultility';
moment.locale('vi');
const GLOBAL = require('../../share/global.js');
export default class Calendar extends Component {
    constructor(props) {
        super(props);
        var d = new Date();
        d.setMonth(d.getMonth() - 1);
        this.state = {
            task: [],
            items: {},
            _markedDates: moment(Date()).format('YYYY-MM-DD'),
            _markedStartDates: moment(d).format('YYYY-MM-DD'),
        };
    }
    componentWillMount() {
        AsyncStorage.getItem('task').then((res, error) => {
            if (res) {
                let taskObject = JSON.parse(res)
                let taskArr = [];
                taskObject.forEach(element => {
                    element.ListTask.Data.forEach(element1 => {
                        taskArr.push(element1);
                    });

                });
                this.setState({
                    task: taskArr
                });
            } else {

            }
        });
    }
    onStartDaySelect(day) {
        console.log('date', day);
        this.setState({
            _markedDates: day.dateString
        });
    }
    render() {
        return (
            <View style={{ marginBottom: 0, flex: 1 }}>
                <Agenda
                    items={this.state.items}
                    loadItemsForMonth={this.loadItems.bind(this)}
                    selected={this.state._markedDates}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    hideKnob={true}
                    // renderKnob={() => { return (<Text>aaa</Text>); }}
                    markingType={"custom"}
                    onDayPress={(day) => this.onStartDaySelect(day)}
                    onRefresh={() => console.log('refreshing...')}
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
                    // monthFormat={'yyyy'}
                    theme={{ calendarBackground: '#FFF', agendaKnobColor: 'green', }}
                    // renderDay={(day, item) => (<Text style={{ color: 'blue' }} >{day ? moment(day.timestamp).format('dddd, DD MMMM') : 'item'}</Text>)}
                    renderDay={(day, item) => (<Text></Text>)}
                // renderDay={(day, item) => (<Text style={day ? { marginTop: 50 } : {}} ></Text>)}

                />
            </View>
        );
    }

    loadItems(day) {
        setTimeout(() => {
            for (let i = -15; i < 15; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = this.timeToString(time);
                if (!this.state.items[strTime]) {
                    let taskByDate = [];
                    this.state.task.forEach(element => {
                        if (moment(element.KetThucEst).format('YYYY-MM-DD') == moment(strTime).format('YYYY-MM-DD')) {
                            taskByDate.push(element);
                        }
                    });
                    this.state.items[strTime] = [];
                    const numItems = taskByDate.length;
                    //thêm line breack
                    this.state.items[strTime].push({
                        name: strTime,
                        height: 58,
                        break: 1
                    });
                    for (let j = 0; j < numItems; j++) {
                        this.state.items[strTime].push({
                            MoTaCongViec: taskByDate[j].MoTaCongViec,
                            IDTrangThai: taskByDate[j].IDTrangThai,
                            MaNhanSuThucHienChinh: taskByDate[j].MaNhanSuThucHienChinh,
                            TenNganNhanSuThucHienChinh: taskByDate[j].TenNganNhanSuThucHienChinh,
                            IDUuTien: taskByDate[j].IDUuTien,
                            IsAllDay: taskByDate[j].IsAllDay,
                            KetThucEst: taskByDate[j].KetThucEst,
                            name: strTime,
                            height: 58,
                            break: 0
                        });
                    }

                }
            }
            //console.log(this.state.items);
            const newItems = {};
            Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
            this.setState({
                items: newItems
            });
        }, 10);
        // console.log(`Load Items for ${day.year}-${day.month}`);
    }

    renderItem(item) {
        var UuTien = {};
        GLOBAL.lstDoUuTien.forEach(element => {
            if (item.IDUuTien == element.ID) {
                UuTien = element
            }
        });
        var TrangThai = {};
        GLOBAL.lstTrangThai.forEach(element => {
            if (item.IDTrangThai == element.ID) {
                TrangThai = element
            }
        });

        return (
            // {item.break==0?}
            <View>
                <View style={[{ height: 52, flexDirection: 'row', }, item.break == 1 ? { display: 'flex' } : { display: 'none' }]}>
                    <Text style={{ flex: 1, lineHeight: 60, marginLeft: 16, fontSize: 15, fontWeight: 'bold' }}>
                        {capitalizeFirstLetter(moment(item.name).format('dddd, DD MMMM'))}
                    </Text>
                    <Text style={{ lineHeight: 60, marginRight: 17, color: '#F1802E', fontSize: 15, }}>
                        {moment(item.name).format('YYYY-MM-DD') == moment(Date()).format('YYYY-MM-DD') ? 'Hôm nay' : ''}
                    </Text>
                </View>
                <View style={[styles.item, { height: item.height }, item.break == 0 ? { display: 'flex' } : { display: 'none' }]}>
                    {/* <Text>{item.name}</Text> */}
                    <View style={{ flexDirection: 'row', height: 58 }}>
                        <View style={{ width: 80 }}>
                            <Text style={[{ lineHeight: 58, marginLeft: 16 }, item.IsAllDay ? {} : moment(item.KetThucEst).format('YYYY-MM-DD hh:mm') > moment(Date()).format('YYYY-MM-DD hh:mm') ? {} : { color: 'red' }]}>
                                {item.IsAllDay ? 'Cả ngày' : moment(item.KetThucEst).format('YYYY-MM-DD hh:mm') > moment(Date()).format('YYYY-MM-DD hh:mm') ? moment(item.KetThucEst).format('hh:mm') : 'Trễ hạn'}
                            </Text>
                        </View>
                        <View style={{ paddingLeft: 13, flex: 1, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#C3C3C3', }}>
                            <Text numberOfLines={1} style={{ lineHeight: 29, fontWeight: 'bold' }}>
                                {item.MoTaCongViec}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[{ lineHeight: 29, flex: 1 }, TrangThai.Color ? { color: TrangThai.Color } : {}]}>
                                    {TrangThai.Name}
                                </Text>
                                <Image style={{ marginTop: 6, width: 15, height: 15, marginLeft: 10, justifyContent: 'center' }} source={require("../../assets/icons/User.png")} />
                                <Text style={{ flex: 1, fontSize: 13, marginLeft: 5, lineHeight: 29, marginRight: 49 }}>{item.MaNhanSuThucHienChinh} - {item.TenNganNhanSuThucHienChinh}</Text>
                                {/* <Image style={[{ marginTop: 6, width: 13, height: 16, marginRight: 17, justifyContent: 'center' }, UuTien.Color ? { color: UuTien.Color } : {}]} source={require("../../assets/icons/flag-yellow.png")} /> */}
                                <CustomIcon name='flag' size={16} style={[{ marginTop: 6, marginRight: 17, justifyContent: 'center' }, UuTien.Color ? { color: UuTien.Color } : {}]} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#F6F6F6',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#C3C3C3',
        // borderRadius: 5,
        // padding: 10,
        // marginRight: 10,
        // marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    }
});