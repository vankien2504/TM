import React, { Component } from "react";
import { AsyncStorage, FlatList, TouchableOpacity, Image, View, Dimensions, style, TextInput, Text, Button, CheckBox, Alert, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchBar from 'react-native-material-design-searchbar';
import Modal from "react-native-modal";
const GLOBAL = require('../../share/global.js');
import TaskService from "../../share/services/task.service";
import CheckboxModest from 'react-native-modest-checkbox'
export default class Employee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.navigation.state.params.params,
            departmentList: [],
            employeeList: [],
            departmentListStand: [],
            employeeListStand: [],
            isDepartment: false,
            organization: false,
            visibleModalDaChonBoPhan: false
        }
    }
    BackPage() {
        this.props.navigation.state.params.onGoBack(this.state.task);
        this.props.navigation.goBack();
    }
    componentWillMount() {
        AsyncStorage.getItem('tokenObject').then((res, error) => {
            GLOBAL.Token = JSON.parse(res);
        });
        if (this.state.task.IDDonVi) {
            this.setState({ isDepartment: true });
        }
        this.DepartmentList();
        this.EmployeeList();
    }
    ChangeIsDepartment() {
        this.setState({ isDepartment: !this.state.isDepartment });
    }
    ChangeOrganization(organization) {
        this.setState({ organization: organization });
        this.setState({ organization: organization }, () => {
            // do something after the stars are rendered
            this.DepartmentList();
            this.EmployeeList();
        })
    }
    DepartmentList() {
        let param = { "IDCongViec": this.state.task.ID, "EditItem": { "Page": 1, "PageSize": 50, "Filter": "", "Sort": "" }, "includeList": this.state.task.IDDonVi ? [this.state.task.IDDonVi] : [] }
        if (this.state.organization) {
            AsyncStorage.getItem('DanhSachBoPhan').then((res, error) => {
                if (res) {
                    let departmentObject = JSON.parse(res);

                    this.setState({ departmentList: departmentObject.Data, employeeListStand: departmentObject.Data })

                } else {
                    TaskService.LayDanhSachBoPhan(param).then((res) => {
                        let departmentObject = JSON.parse(res);
                        try {
                            AsyncStorage.setItem('DanhSachBoPhan', res);
                        } catch (error) {
                            console.log("Error saving data" + error);
                        }
                        this.setState({ departmentList: departmentObject.Data, employeeListStand: departmentObject.Data })
                    });
                }
            });


        } else {
            AsyncStorage.getItem('DanhSachBoPhanKhongThuocCoCau').then((res, error) => {
                if (res) {
                    let departmentObject = JSON.parse(res)
                    this.setState({ departmentList: departmentObject.Data, departmentListStand: departmentObject.Data })

                } else {
                    TaskService.LayDanhSachBoPhanKhongThuocCoCau(param).then((res) => {
                        let departmentObject = JSON.parse(res)
                        this.setState({ departmentList: departmentObject.Data, departmentListStand: departmentObject.Data })
                    });
                }
            });


        }

    }
    EmployeeList() {
        let param = { "IDCongViec": this.state.task.ID, "EditItem": { "Page": 1, "PageSize": 50, "Filter": "", "Sort": "" }, excludeList: [], "includeList": this.state.task.IDNhanSuThucHienChinh ? [this.state.task.IDNhanSuThucHienChinh] : [GLOBAL.userInfo.IDNhanSu] }
        if (this.state.organization) {
            AsyncStorage.getItem('DanhSachNhanSu').then((res, error) => {
                if (res) {

                    let employeeObject = JSON.parse(res)
                    this.setState({ employeeList: employeeObject.Data, employeeListStand: employeeObject.Data })

                } else {

                    TaskService.LayDanhSachNhanSu(param).then((res) => {
                        let employeeObject = JSON.parse(res);
                        try {
                            AsyncStorage.setItem('DanhSachNhanSu', res);
                        } catch (error) {
                            console.log("Error saving data" + error);
                        }
                        this.setState({ employeeList: employeeObject.Data, employeeListStand: employeeObject.Data })
                    });
                }
            });


        } else {
            AsyncStorage.getItem('DanhSachNhanSuKhongTheoCoCau').then((res, error) => {
                if (res) {
                    let employeeObject = JSON.parse(res)
                    this.setState({ employeeList: employeeObject.Data, employeeListStand: employeeObject.Data })

                } else {
                    TaskService.LayDanhSachNhanSuKhongTheoCoCau(param).then((res) => {
                        let employeeObject = JSON.parse(res);
                        try {
                            AsyncStorage.setItem('DanhSachNhanSuKhongTheoCoCau', res);
                        } catch (error) {
                            console.log("Error saving data" + error);
                        }
                        this.setState({ employeeList: employeeObject.Data, employeeListStand: employeeObject.Data })
                    });
                }
            });

        }
    }
    EditDepartment(IDDonVi) {
        this.state.task.IDDonVi = IDDonVi;
        let params = { EditField: 'IDDonVi', EditItem: this.state.task }
        this.setState({
            task: this.state.task,
            visibleModalDaChonBoPhan: true
        });
        TaskService.EditData(params).then((res) => {
            let taskObject = JSON.parse(res)
            this.setState({
                task: taskObject.Data[0]
            });
        });
    }
    EditEmployee(IDNhanSuThucHienChinh) {
        this.state.task.IDNhanSuThucHienChinh = IDNhanSuThucHienChinh;
        let params = { EditField: 'IDNhanSuThucHienChinh', EditItem: this.state.task }
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
    renderModalDaChonBoPhan = () => (
        <View style={styles.modalContent}>
            <View style={{ flexDirection: "row", alignSelf: 'center' }}>
                <Image
                    style={{ marginLeft: 0, marginRight: 15, height: 24, width: 24 }}
                    source={require('../../assets/icons/success.png')}
                />
                <Text style={{ fontFamily: 'Muli', fontWeight: 'bold', color: '#5CB800', fontSize: 15 }}>Đã chọn bộ phận</Text>
            </View>
            <Text style={{ marginTop: 20, fontFamily: 'Muli', color: '#5d5d5d', fontSize: 15 }}>
                Bạn đã chọn một <Text style={{ color: '#F1802E' }}>bộ phận</Text></Text>
            <Text style={{ marginTop: 10, fontFamily: 'Muli', color: '#5d5d5d', fontSize: 15 }}>
                Hệ thống sẽ tự động chỉ định <Text style={{ color: '#F1802E' }}>trưởng bộ phận</Text> đó làm nhân sự chịu trách nhiệm.</Text>
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
            <TouchableOpacity onPress={() => this.setState({ visibleModalDaChonBoPhan: false })}>
                <View style={{ flexDirection: 'row', height: 20, marginTop: 40, marginBottom: 30 }}>
                    <View style={{ flex: 1 }}>

                    </View>
                    <Text style={{ marginRight: 42, lineHeight: 20, fontSize: 15, fontWeight: 'bold' }}>
                        CHỌN LẠI
                </Text>
                    <Text style={{ lineHeight: 20, color: '#0092FF', fontSize: 15, fontWeight: 'bold' }}>
                        OK
                </Text>
                </View>

            </TouchableOpacity>

        </View>
    );
    render() {
        return (
            <View style={[styles.scene, { backgroundColor: '#EDEFF3' }]} >
                <Modal
                    isVisible={this.state.visibleModalDaChonBoPhan}
                    onBackdropPress={() => this.setState({ visibleModalDaChonBoPhan: false })}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight">
                    {this.renderModalDaChonBoPhan()}
                </Modal>
                <View style={styles.header} >
                    <TouchableOpacity onPress={() => this.BackPage()}>
                        <Image
                            style={{ marginTop: 19, marginLeft: 10, marginRight: 24, height: 17, width: 9 }}
                            source={require('../../assets/icons/Arrow_left.png')}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 54 }}>
                        Thực hiện
                        </Text>

                </View>
                <View style={styles.searchBox} >
                    <TouchableOpacity onPress={() => this.ChangeIsDepartment()}>
                        <Image
                            style={{ margin: 10, height: 22, width: 22 }}
                            source={this.state.isDepartment ? require('../../assets/icons/department.png') : require('../../assets/icons/UserEmployee.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ borderLeftColor: '#C3C3C3', borderLeftWidth: 1, height: 24, marginTop: 8 }}>

                    </View>
                    <View style={{ flex: 1 }}>
                        <SearchBar
                            onSearchChange={text => this.searchFilterFunction(text)}
                            height={40}
                            iconSearchComponent={<View></View>}
                            iconBackComponent={<View></View>}
                            onFocus={() => console.log('On Focus')}
                            onBlur={() => console.log('On Blur')}
                            placeholder={'Tìm kiếm nhân sự...'}
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
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 16, flex: 1 }}>
                        Tìm theo:
                    </Text>
                    <View style={{ marginRight: 19 }}>
                        <CheckboxModest
                            checked={this.state.organization}
                            label='Tất cả'
                            labelStyle={{ fontSize: 15, color: '#5D5D5D' }}
                            labelBefore={true}
                            checkedComponent={<Image
                                labelStyle={{ color: '#5d5d5d', fontSize: 15, fontWeight: 'bold' }}
                                style={{ height: 20, width: 20 }}
                                source={require('../../assets/icons/radioCheck.png')} />}
                            uncheckedComponent={<Image
                                style={{ height: 20, width: 20, marginTop: 2 }}
                                source={require('../../assets/icons/radioCheckActive.png')} />}
                            onChange={() => { this.ChangeOrganization(false) }}
                        />
                    </View>
                    <View style={{ borderLeftColor: '#C3C3C3', borderLeftWidth: 1, height: 24 }}></View>
                    <View style={{ marginRight: 15 }}>
                        <CheckboxModest
                            checked={!this.state.organization}
                            label='Cơ cấu tổ chức'
                            labelStyle={{ fontSize: 15, color: '#5D5D5D' }}
                            labelBefore={true}
                            checkedComponent={<Image
                                labelStyle={{ color: '#5d5d5d', fontSize: 15, fontWeight: 'bold' }}
                                style={{ height: 20, width: 20 }}
                                source={require('../../assets/icons/radioCheck.png')} />}
                            uncheckedComponent={<Image
                                style={{ height: 20, width: 20, marginTop: 2 }}
                                source={require('../../assets/icons/radioCheckActive.png')} />}
                            onChange={() => { this.ChangeOrganization(true) }}
                        />
                    </View>
                </View>
                {/* <View style={{ flexDirection: 'row', backgroundColor: '#999999', height: 24 }}>
                    <Text style={{ lineHeight: 24, color: '#FFF' }}>
                        BA01 - Nguyễn Thị Nga
                    </Text>
                </View> */}
                <View style={[{ marginTop: 20 }, this.state.isDepartment ? { display: 'flex' } : { display: 'none' }]}>
                    <FlatList
                        data={this.state.departmentList}
                        extraData={this.state}
                        keyExtractor={(item) => item.ID.toString()}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.EditDepartment(item.ID)}>
                                <View style={{ flexDirection: 'row', backgroundColor: '#FFF', height: 40, borderBottomColor: '#C3C3C3', borderBottomWidth: 1 }}>
                                    <Text style={[{ lineHeight: 40, marginLeft: 16, flex: 1 }, this.state.task.IDDonVi == item.ID ? { color: '#5CB800' } : {}]}>
                                        {item.Ma} -  {item.Ten}
                                    </Text>
                                    <Text style={[{ lineHeight: 40, marginRight: 16, color: '#5CB800' }, this.state.task.IDDonVi == item.ID ? { display: 'flex' } : { display: 'none' }]} >
                                        đang chọn
                                </Text>

                                </View>
                            </TouchableOpacity>
                        }
                        contentContainerStyle={{ paddingBottom: 120 }}
                    />
                </View>
                <View style={[{ marginTop: 20 }, !this.state.isDepartment ? { display: 'flex' } : { display: 'none' }]}>
                    <FlatList
                        data={this.state.employeeList}
                        extraData={this.state}
                        keyExtractor={(item) => item.ID.toString()}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.EditEmployee(item.ID)}>
                                <View style={{ flexDirection: 'row', backgroundColor: '#FFF', height: 40, borderBottomColor: '#C3C3C3', borderBottomWidth: 1 }}>
                                    <Text style={[{ lineHeight: 40, marginLeft: 16, flex: 1 }, this.state.task.IDNhanSuThucHienChinh == item.ID ? { color: '#5CB800' } : {}]}>
                                        {item.Ma} -  {item.Ten}
                                    </Text>
                                    <Text style={[{ lineHeight: 40, marginRight: 16, color: '#5CB800' }, this.state.task.IDNhanSuThucHienChinh == item.ID ? { display: 'flex' } : { display: 'none' }]} >
                                        đang chọn
                                </Text>

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
        flexDirection: 'row',
        backgroundColor: '#FFF',
        height: 40,
        margin: 16,
        borderRadius: 3,
        flexDirection: 'row'
    },
    modalContent: {
        backgroundColor: "#FFF",
        paddingLeft: 26,
        paddingRight: 26,
        paddingTop: 20,
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
})
