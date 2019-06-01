import React, { Component } from "react";
import { AsyncStorage, FlatList, TouchableOpacity, Image, View, Dimensions, style, TextInput, Text, Button, CheckBox, Alert, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchBar from 'react-native-material-design-searchbar';
import Modal from "react-native-modal";
const GLOBAL = require('../../share/global.js');
import TaskService from "../../share/services/task.service";
import CheckboxModest from 'react-native-modest-checkbox'
export default class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.navigation.state.params.params,
            visibleModalCreateTag: false,
            NewNameTag: '',
            NewColor: '',
            lstColor: ['#008000', '#5CB800', '#AA52B0', '#739AFA', '#FF6700', '#FFCB2B', '#00AE68', '#C03221', '#F85858', '#E63462', '#93A3B1', '#7E7E7E', '#054A91', '#5293B0', '#20A8B4', '#8C5519', '#D8973C', '#F1802E'],
            tagListStand: GLOBAL.lstNhan,
            tagList: GLOBAL.lstNhan,
            refreshing: false
        }
    }
    BackPage() {
        this.props.navigation.state.params.onGoBack(this.state.task);
        this.props.navigation.goBack();
    }
    componentWillMount() {
        GLOBAL.lstNhan;

    }
    CreateTag() {
        this.state.refreshing = true;
        let params = {
            Color: this.state.NewColor,
            Favorite: false,
            Hide: false,
            ID: 0,
            IDNhanSu: GLOBAL.userInfo.IDNhanSu,
            IDThongTinKhachHang: '',
            Name: this.state.NewNameTag,
            Sort: 4
        }
        this.setState({ refreshing: true });
        TaskService.ThemMoiNhan(params).then((res) => {
            this.LayDanhSachNhan();
        });
    }
    LayDanhSachNhan() {
        let param = {
            "request": [
                { "Page": 1, "PageSize": 50, "Filter": "", Sort: "Sort-asc" },
            ]
        }
        TaskService.LayDanhSachNhan(param).then((res) => {
            let responseJson = JSON.parse(res)
            GLOBAL.lstNhan = responseJson.Data;
            this.setState({ tagList: GLOBAL.lstNhan, visibleModalCreateTag: false, refreshing: false });
        });
    }
    EditTag(item) {
        let index = this.state.task.lstNhan.map(function (e) { return e.ID; }).indexOf(item.ID);
        if (index > -1) {
            this.state.task.lstNhan.splice(index, 1);
        } else {
            this.state.task.lstNhan.push(item);
        }

        let params = { EditField: 'lstNhan', EditItem: this.state.task }
        this.setState({
            task: this.state.task,
        });
        TaskService.EditData(params).then((res) => {
            let taskObject = JSON.parse(res)
            this.setState({
                task: taskObject.Data[0]
            });
        });
    }

    searchFilterFunction = text => {
        const newDepartmentList = this.state.departmentListStand.filter(item => {
            const itemData = `${item.Ten.toUpperCase()} ${item.Ma}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        const newEmployeeList = this.state.employeeListStand.filter(item => {
            const itemData = `${item.Ten.toUpperCase()} ${item.Ma}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            departmentList: newDepartmentList,
            employeeList: newEmployeeList
        });
    };
    renderModalCreateTag = () => (

        <View>
            <View style={{
                height: 48, backgroundColor: '#EFF1F6', borderTopLeftRadius: 4,
                borderTopRightRadius: 4
            }}>
                <Text style={{ lineHeight: 48, marginLeft: 24, fontFamily: 'Muli', fontWeight: 'bold', fontSize: 15 }}>TẠO MỚI TAG</Text>
            </View>
            <View style={styles.modalContent}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontFamily: 'Muli', color: '#5d5d5d', fontSize: 15, fontWeight: 'bold' }}>
                        Tên tag
                    </Text>
                    <View style={{ flex: 1 }}>
                        <SearchBar
                            onSearchChange={text => this.setState({ NewNameTag: text })}
                            height={24}
                            iconSearchComponent={<View></View>}
                            iconBackComponent={<View></View>}
                            onFocus={() => console.log('On Focus')}
                            onBlur={() => console.log('On Blur')}
                            placeholder={'Nhập tên...'}
                            inputStyle={{ padding: 0, paddingLeft: 15, paddingRight: 10, borderRadius: 3, backgroundColor: '#FFF', borderColor: "#FFF" }}
                            textStyle={{ borderBottomColor: '#C3C3C3', borderBottomWidth: 1, padding: 0, fontFamily: "Muli", fontSize: 15, color: "#5d5d5d", backgroundColor: '#FFF' }}
                            padding={0}
                            iconPadding={0}
                            iconColor={'#5d5d5d'}
                            iconSize={20}
                            autoCorrect={false}
                            returnKeyType={'search'}
                        />
                    </View>
                </View>


                <Text style={{ marginTop: 20, fontFamily: 'Muli', color: '#5d5d5d', fontSize: 15, fontWeight: 'bold' }}>
                    Màu sắc
                </Text>
                <View style={{ marginTop: 12, flexDirection: "row", flexWrap: 'wrap' }}>

                    {
                        this.state.lstColor.map((item, index) => {
                            return (
                                <CheckboxModest
                                    key={item}
                                    checked={item == this.state.NewColor}
                                    label=''
                                    checkedComponent={<Text style={{ height: 28, width: 28, paddingTop: 5, paddingLeft: 9, color: '#FFF', borderRadius: 28, backgroundColor: item, marginBottom: 20 }}>✔</Text>}
                                    uncheckedComponent={<Text style={{ height: 28, width: 28, borderRadius: 28, backgroundColor: item, marginBottom: 20 }}></Text>}
                                    onChange={() => this.setState({ NewColor: item })}
                                />
                            )
                        })
                    }
                </View>

                <View style={{ flexDirection: 'row', height: 20, marginTop: 40, marginBottom: 30 }}>
                    <View style={{ flex: 1 }}>

                    </View>
                    <TouchableOpacity onPress={() => this.setState({ visibleModalCreateTag: false })}>
                        <Text style={{ marginRight: 42, lineHeight: 20, fontSize: 15, fontWeight: 'bold' }}>
                            HỦY
                </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.CreateTag()}>
                        <Text style={{ lineHeight: 20, color: '#0092FF', fontSize: 15, fontWeight: 'bold' }}>
                            TẠO
                </Text>
                    </TouchableOpacity>
                </View>



            </View>

        </View>
    );
    render() {
        return (
            <View style={[styles.scene, { backgroundColor: '#EDEFF3' }]} >
                <Modal
                    isVisible={this.state.visibleModalCreateTag}
                    onBackdropPress={() => this.setState({ visibleModalCreateTag: false })}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight">
                    {this.renderModalCreateTag()}
                </Modal>
                <View style={styles.header} >
                    <TouchableOpacity onPress={() => this.BackPage()}>
                        <Image
                            style={{ marginTop: 19, marginLeft: 10, marginRight: 24, height: 17, width: 9 }}
                            source={require('../../assets/icons/Arrow_left.png')}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 54 }}>
                        Tag công việc
                        </Text>

                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.searchBox} >
                        <SearchBar
                            onSearchChange={text => this.searchFilterFunction(text)}
                            height={40}
                            onFocus={() => console.log('On Focus')}
                            onBlur={() => console.log('On Blur')}
                            placeholder={'Tìm kiếm...'}
                            inputStyle={{ padding: 0, paddingLeft: 15, paddingRight: 10, borderRadius: 3, backgroundColor: '#FFF', borderColor: "#FFF" }}
                            textStyle={{ padding: 0, paddingLeft: 15, fontFamily: "Muli", fontSize: 15, color: "#5d5d5d", backgroundColor: '#FFF' }}
                            padding={0}
                            iconPadding={0}
                            iconColor={'#5d5d5d'}
                            autoCorrect={false}
                            returnKeyType={'search'}
                        />
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ visibleModalCreateTag: true })}>
                        <Image
                            style={{ marginRight: 16, marginTop: 16, height: 40, width: 40 }}
                            source={require('../../assets/icons/TagAdd.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={[{ marginTop: 24 }]}>
                    <FlatList
                        data={this.state.tagList}
                        extraData={this.state}
                        keyExtractor={(item) => item.ID.toString()}
                        refreshing={this.state.refreshing}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.EditTag(item)}>
                                <View style={{ flexDirection: 'row', height: 40, borderBottomColor: '#C3C3C3', borderBottomWidth: 1 }}>
                                    <Text style={[{ height: 16, marginTop: 11, paddingLeft: 6, paddingRight: 6, lineHeight: 16, marginLeft: 16, color: '#FFF', backgroundColor: item.Color, borderRadius: 8 }]}>
                                        {item.Name}
                                    </Text>
                                    <View style={{ flex: 1 }}>

                                    </View>
                                    <Image
                                        style={{ marginTop: 13, marginRight: 16, height: 14, width: 14 }}
                                        source={(this.state.task.lstNhan.map(function (e) { return e.ID; }).indexOf(item.ID) > -1) ? require('../../assets/icons/check.png') : require('../../assets/icons/uncheck.png')}
                                    />

                                </View>
                            </TouchableOpacity>
                        }
                        contentContainerStyle={{ paddingBottom: 120 }}
                    />
                </View>
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
    searchBox: {
        //Its for IOS
        shadowColor: 'rgba(0, 0, 0, 0.16)',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.2,
        // its for android
        elevation: 5,
        position: 'relative',
        flex: 1,
        backgroundColor: '#FFF',
        height: 40,
        margin: 16,
        marginBottom: 0,
        borderRadius: 3,
    },
    modalContent: {
        backgroundColor: "#FFF",
        paddingLeft: 26,
        paddingRight: 26,
        paddingTop: 24,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
})
