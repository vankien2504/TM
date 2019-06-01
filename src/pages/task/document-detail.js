import React, { Component } from "react";
import { Linking, AsyncStorage, FlatList, TouchableOpacity, Image, View, Dimensions, style, TextInput, Text, Button, CheckBox, Alert, StyleSheet } from "react-native";
const GLOBAL = require('../../share/global.js');
import TaskService from "../../share/services/task.service";
import pick from "../../share/customize/image-picker";
import RNFetchBlob from 'react-native-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import TaskCheckEditService from "../../share/services/task-check-edit.service";
import Modal from "react-native-modal";
export default class DocumentDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.navigation.state.params.params,

            isAddLink: false,
            NewFileName: '',
            avatarSource: '',

            outputList: [],
            outputCalendarList: [],
            outputLinkList: [],
            outputFileList: [],

            outputTotal: 0,
            outputCalendarTotal: 0,
            outputFileTotal: 0,
            outputLinkTotal: 0,

            isChangeCalendar: -1,
            isChangeLink: -1,
            isChangeLinkMoTa: -1,

            isChangeFileMoTa: -1,

            checkNotify: {},
            visibleModalNotify: false,
        }
    }
    BackPage() {
        this.props.navigation.state.params.onGoBack(this.state.task);
        this.props.navigation.goBack();
    }
    ChangePage(page, params, type) {
        this.state.checkNotify = TaskCheckEditService.checkAddOutputFile(this.state.task);
        if (this.state.checkNotify.result) {
            this.props.navigation.navigate(page, {
                params, type,
                onGoBack: (task) => this.refresh(task),
            });
        } else {
            // hiển thị popup thông báo
            this.setState({ visibleModalNotify: true });
        }
    }
    refresh(task) {
        this.props.navigation.state;
        // this.props.callbackFromParent({ Attribute: "ChangeData" });
        this.OutputList();
    }
    componentWillMount() {
        this.OutputList();
    }
    OutputList() {
        let param = { "Page": 1, "PageSize": 50, "Filter": "IDCongViec~eq~" + this.state.task.ID + "~and~Type~eq~1", "Sort": "" };
        TaskService.LayDanhKetQuaDauRa(param).then((res) => {
            let outputObject = JSON.parse(res)
            this.state.outputCalendarList = [];
            this.state.outputLinkList = [];
            this.state.outputFileList = [];
            this.state.outputCalendarTotal = 0;
            this.state.outputLinkTotal = 0;
            this.state.outputFileTotal = 0;
            outputObject.Data.forEach(element => {
                this.state.outputTotal = this.state.outputTotal + element.listFile.length;
                if (element.LoaiKetQua == 2) {
                    this.state.outputLinkList = this.state.outputLinkList.concat(element.listFile);
                    this.state.outputLinkTotal = this.state.outputLinkTotal + element.listFile.length;
                }
                if (element.LoaiKetQua == 0) {
                    this.state.outputFileList = this.state.outputFileList.concat(element.listFile);
                    this.state.outputFileTotal = this.state.outputFileTotal + element.listFile.length
                }
                if (element.LoaiKetQua == 1) {
                    this.state.outputTotal += 1;
                    this.state.outputCalendarList.push(element);
                    this.state.outputCalendarTotal = this.state.outputCalendarTotal + 1;
                }
            });
            this.setState({
                outputList: outputObject.Data,
                outputCalendarList: this.state.outputCalendarList,
                outputLinkList: this.state.outputLinkList,
                outputFileList: this.state.outputFileList,

                outputTotal: this.state.outputTotal,
                outputCalendarTotal: this.state.outputCalendarTotal,
                outputFileTotal: this.state.outputFileTotal,
                outputLinkTotal: this.state.outputLinkTotal
            })
        });
    }
    FetchBlob() {

        RNFetchBlob.fetch('POST', 'https://id.ooc.vn/api/tm/TM/ThemMoi_UploadFile', {
            Authorization: 'Bearer ' + GLOBAL.Token.access_token,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        }, [
                // // element with property `filename` will be transformed into `file` in form data
                // { name: 'avatar', filename: 'avatar.png', data: binaryDataInBase64 },
                // // custom content type
                // { name: 'avatar-png', filename: 'avatar-png.png', type: 'image/png', data: binaryDataInBase64 },
                // // part file from storage
                // { name: 'avatar-foo', filename: 'avatar-foo.png', type: 'image/foo', data: RNFetchBlob.wrap(path_to_a_file) },
                // elements without property `filename` will be sent as plain text
                { name: 'info', data: 'Kiên' }

            ]).then((resp) => {
                console.log(resp);
                // ...
            }).catch((err) => {
                console.log(err);
                // ...
            })
    }
    Upload(response, item) {
        var dataAsFormData = new FormData();
        var fd = response.data.replace(/^data:image\/png;base64,/, "");

        dataAsFormData.append("base64", fd);
        dataAsFormData.append("IDKhachHang", GLOBAL.userInfo.IDCongTy.toString());
        dataAsFormData.append("username", GLOBAL.userInfo.UserName);
        dataAsFormData.append("IDCongViec", item.IDCongViec.toString());
        dataAsFormData.append("IDKetQua", item.IDKetQua.toString());
        dataAsFormData.append("IDNhanSuTao", GLOBAL.userInfo.IDNhanSu.toString());
        TaskService.XoaFileDinhKem(item).then((res) => {
            TaskService.ThemMoi_UploadFileHinhDuLieuBase64(dataAsFormData).then((res) => {
                let fileObject = JSON.parse(res)
                this.OutputList();
            });
        });
        this.setState({ avatarSource: response.uri })
    }
    TakePhoto(item) {
        pick(response => this.Upload(response, item));
    }
    CountLinkTotal() {
        this.state.outputLinkTotal = 0;
        this.state.outputFileTotal = 0;
        this.state.output.listFile.forEach(element => {
            if (element.Type == 2) {
                this.state.outputLinkTotal++;
                this.setState({ outputLinkTotal: this.state.outputLinkTotal })
            }
            if (element.Type == 1) {
                this.state.outputFileTotal++;
                this.setState({ outputFileTotal: this.state.outputFileTotal })
            }
        });
    }
    EditOutput() {
        let params = this.state.output;

        TaskService.CapNhatKetQuaDauRa(params).then((res) => {
            let outputObject = JSON.parse(res)
            this.setState({
                output: outputObject.Data[0],
                isChangeLink: false
            });
        });
    }
    EditCarlendar(item) {
        let params = item;
        TaskService.CapNhatKetQuaDauRa(params).then((res) => {
            this.setState({ isChangeCalendar: -1 });
            this.OutputList();
        });
    }
    ChangeLink(text, index, type) {
        if (type == 'mota') {
            this.state.outputLinkList[index].MoTa = text;
        } else {
            this.state.outputLinkList[index].URL = text;
        }

        this.setState({
            outputLinkList: this.state.outputLinkList
        });
    }
    EditLink(item) {
        let params = item;
        TaskService.CapNhatFILETaiLieu(params).then((res) => {
            this.setState({ isChangeLink: -1, isChangeLinkMoTa: -1 });
            this.OutputList();
        });
    }
    ChangeFile(text, index, type) {
        if (type == 'mota') {
            this.state.outputFileList[index].MoTa = text;
        }
        this.setState({
            outputFileList: this.state.outputFileList
        });
    }
    EditFile(item) {
        let params = item;
        TaskService.CapNhatFILETaiLieu(params).then((res) => {
            this.setState({ isChangeFileMoTa: -1 });
            this.OutputList();
        });
    }
    EditOutputFile(index) {
        let params = this.state.output.listFile[index];

        TaskService.CapNhatFILETaiLieu(params).then((res) => {
            let outputObject = JSON.parse(res)
            this.state.output.listFile[index] = outputObject.Data[0];
            this.setState({
                output: this.state.output,
                isChangeLink: false
            });
        });
    }
    DeleteOutput(item) {

        let params = item;
        TaskService.XoaCongViec_KetQuaDauRa(params).then((res) => {
            let outputObject = JSON.parse(res)
            this.OutputList();
        });
    }
    DeleteOutputFile(item) {
        let params = item;
        TaskService.XoaFileDinhKem(params).then((res) => {
            let outputObject = JSON.parse(res)
            this.OutputList();
        });
    }
    AddOutputFile() {

        let params = { "ID": 0, "Type": 2, "IDKetQua": this.state.output.ID, "IDCongViec": this.state.output.IDCongViec, "MoTa": "", "URL": this.state.NewFileName, "uid": "", "isEdit": false };
        TaskService.ThemMoiFileTaiLieuTheoLink(params).then((res) => {
            let outputFileObject = JSON.parse(res)
            this.state.output.listFile.unshift(outputFileObject.Data[0]);
            this.CountLinkTotal();
            this.setState({
                output: this.state.output,
                isAddLink: false,
                NewFileName: ''
            });
        });
    }
    OutputAdd() {

    }
    ChangeCalendar(text, index) {
        this.state.outputCalendarList[index].MoTa = text;
        this.setState({
            outputCalendarList: this.state.outputCalendarList
        });
    }
    download(outputFile) {
        var date = new Date();
        var url = GLOBAL.serviceURL.urlIDServer + outputFile.URL;
        var ext = this.extention(url);
        ext = "." + ext[0];
        const { config, fs, android } = RNFetchBlob
        let PictureDir = fs.dirs.PictureDir
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: PictureDir + "/" + Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
                description: 'File'
            }
        }
        config(options).fetch('GET', url).then((res) => {
            FileViewer.open(res.path())
                .then(() => {
                    // success
                })
                .catch(error => {
                    // error
                });
        });
    }
    extention(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
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
    render() {
        return (
            <View style={[styles.scene, { backgroundColor: '#EDEFF3' }]} >
                <Modal
                    isVisible={this.state.visibleModalNotify}
                    onBackdropPress={() => this.setState({ visibleModalNotify: false })}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight">
                    {this.renderModalNotify()}
                </Modal>
                <View style={styles.header} >
                    <TouchableOpacity onPress={() => this.BackPage()}>
                        <Image
                            style={{ marginTop: 19, marginLeft: 16, marginRight: 24, height: 17, width: 9 }}
                            source={require('../../assets/icons/Arrow_left.png')}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 54 }}>
                        Kết quả đầu ra
                        </Text>
                </View>
                <View>
                    <View style={{ height: 40, flexDirection: 'row' }}>
                        <Image
                            style={{ marginTop: 10, marginLeft: 16, marginRight: 12, width: 19, height: 20 }}
                            source={require('../../assets/icons/Calendar.png')}
                        />
                        <Text style={{ flex: 1, lineHeight: 40, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            Lịch hẹn ({this.state.outputCalendarTotal})
                    </Text>
                        <TouchableOpacity onPress={() => this.ChangePage('DocumentAddScreen', this.state.task, 'lich')}>
                            <Text
                                style={{ marginTop: 11, marginLeft: 10, marginRight: 16, color: '#0092FF' }}
                            >
                                + thêm lịch hẹn
                    </Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={this.state.outputCalendarList}
                        extraData={this.state}
                        keyExtractor={(item) => item.ID.toString()}
                        renderItem={({ item, index }) =>
                            <View style={[{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }]}>
                                <TouchableOpacity style={[{ marginLeft: 16, height: 40, marginRight: 24, flex: 1 }, this.state.isChangeCalendar != index ? { display: 'flex' } : { display: 'none' }]}>
                                    <Text style={[{ lineHeight: 40, color: '#0092FF' }]}>
                                        {item.MoTa}
                                    </Text>
                                </TouchableOpacity>
                                <TextInput
                                    style={[{ padding: 0, flex: 1, padding: 0, margin: 0, marginLeft: 16, marginRight: 24, height: 40 }, this.state.isChangeCalendar == index ? { display: 'flex' } : { display: 'none' }]}
                                    placeholder="Mô tả..."
                                    value={item.MoTa}
                                    onChangeText={(text) => this.ChangeCalendar(text, index)}
                                    onBlur={() => this.EditCarlendar(item)}
                                />
                                <TouchableOpacity onPress={() => this.setState({ isChangeCalendar: index })}>
                                    <Image
                                        style={{ marginLeft: 0, marginTop: 12, marginRight: 27, height: 15, width: 14 }}
                                        source={require('../../assets/icons/edit.png')}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.DeleteOutput(item)}>
                                    <Image
                                        style={{ marginLeft: 0, marginTop: 12, marginRight: 16, height: 15, width: 14 }}
                                        source={require('../../assets/icons/Trash.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                        }
                        maxToRenderPerBatch={1}
                        windowSize={5}
                        onEndReachedThreshold={0.5}
                        removeClippedSubviews={true}
                        disableVirtualization={true}
                        maxToRenderPerBatch={1}
                        initialNumToRender={5}
                    />
                </View>
                <View>
                    <View style={{ height: 40, flexDirection: 'row' }}>
                        <Image
                            style={{ marginTop: 10, marginLeft: 16, marginRight: 12, width: 20, height: 20 }}
                            source={require('../../assets/icons/link.png')}
                        />
                        <Text style={{ flex: 1, lineHeight: 40, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            Liên kết ({this.state.outputLinkTotal})
                    </Text>
                        <TouchableOpacity onPress={() => this.ChangePage('DocumentAddScreen', this.state.task, 'link')}>
                            <Text
                                style={{ marginTop: 11, marginLeft: 10, marginRight: 16, color: '#0092FF' }}
                            >
                                + thêm liên kết
                    </Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={this.state.outputLinkList}
                        extraData={this.state}
                        keyExtractor={(item) => item.ID.toString()}
                        renderItem={({ item, index }) =>
                            <View>

                                <View style={[{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }]}>
                                    <Text style={{ marginLeft: 16, lineHeight: 40 }}>Mô tả</Text>
                                    <TouchableOpacity style={[{ marginLeft: 16, height: 40, marginRight: 24, flex: 1 }, this.state.isChangeLinkMoTa != index ? { display: 'flex' } : { display: 'none' }]}>
                                        <Text style={[{ lineHeight: 40 }]}>
                                            {item.MoTa}
                                        </Text>
                                    </TouchableOpacity>
                                    <TextInput
                                        style={[{ padding: 0, flex: 1, padding: 0, margin: 0, marginLeft: 16, marginRight: 24, height: 40 }, this.state.isChangeLinkMoTa == index ? { display: 'flex' } : { display: 'none' }]}
                                        placeholder="Mô tả..."
                                        value={item.MoTa}
                                        onChangeText={(text) => this.ChangeLink(text, index, 'mota')}
                                        onBlur={() => this.EditLink(item)}
                                    />
                                    <TouchableOpacity onPress={() => this.setState({ isChangeLinkMoTa: index })}>
                                        <Image
                                            style={{ marginLeft: 0, marginTop: 12, marginRight: 27, height: 15, width: 14 }}
                                            source={require('../../assets/icons/edit.png')}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.DeleteOutputFile(item)}>
                                        <Image
                                            style={{ marginLeft: 0, marginTop: 12, marginRight: 16, height: 15, width: 14 }}
                                            source={require('../../assets/icons/Trash.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={[{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }]}>

                                    <TouchableOpacity onPress={() => Linking.openURL(item.URL)} style={[{ marginLeft: 16, height: 40, marginRight: 24, flex: 1 }, this.state.isChangeLink != index ? { display: 'flex' } : { display: 'none' }]}>
                                        <Text style={[{ lineHeight: 40, color: '#0092FF' }]}>
                                            {item.URL}
                                        </Text>
                                    </TouchableOpacity>
                                    <TextInput
                                        style={[{ padding: 0, flex: 1, padding: 0, margin: 0, marginLeft: 16, marginRight: 24, height: 40 }, this.state.isChangeLink == index ? { display: 'flex' } : { display: 'none' }]}
                                        placeholder="Mô tả..."
                                        value={item.URL}
                                        onChangeText={(text) => this.ChangeLink(text, index, 'url')}
                                        onBlur={() => this.EditLink(item)}
                                    />
                                    <TouchableOpacity onPress={() => this.setState({ isChangeLink: index })}>
                                        <Image
                                            style={{ marginLeft: 0, marginTop: 12, marginRight: 57, height: 15, width: 14 }}
                                            source={require('../../assets/icons/edit.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                        }
                        maxToRenderPerBatch={1}
                        windowSize={5}
                        onEndReachedThreshold={0.5}
                        removeClippedSubviews={true}
                        disableVirtualization={true}
                        maxToRenderPerBatch={1}
                        initialNumToRender={5}
                    />
                </View>
                <View>
                    <View style={{ height: 40, flexDirection: 'row' }}>
                        <Image
                            style={{ marginTop: 10, marginLeft: 16, marginRight: 12, width: 15, height: 21 }}
                            source={require('../../assets/icons/attach.png')}
                        />
                        <Text style={{ flex: 1, lineHeight: 40, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            File đính kèm ({this.state.outputFileTotal})
                    </Text>
                        <TouchableOpacity onPress={() => this.ChangePage('DocumentAddScreen', this.state.task, 'file')}>
                            <Text
                                style={{ marginTop: 11, marginLeft: 10, marginRight: 16, color: '#0092FF' }}
                            >
                                + thêm đính kèm
                    </Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={this.state.outputFileList}
                        extraData={this.state}
                        keyExtractor={(item) => item.ID.toString()}
                        renderItem={({ item, index }) =>
                            <View>

                                <View style={[{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }]}>
                                    {/* <Text style={{ marginLeft: 16, lineHeight: 40 }}>{item.MoTa}</Text> */}
                                    <TouchableOpacity style={[{ marginLeft: 16, height: 40, marginRight: 24, flex: 1 }, this.state.isChangeFileMoTa != index ? { display: 'flex' } : { display: 'none' }]}>
                                        <Text style={[{ lineHeight: 40 }]}>
                                            {item.MoTa}
                                        </Text>
                                    </TouchableOpacity>
                                    <TextInput
                                        style={[{ padding: 0, flex: 1, padding: 0, margin: 0, marginLeft: 16, marginRight: 24, height: 40 }, this.state.isChangeFileMoTa == index ? { display: 'flex' } : { display: 'none' }]}
                                        placeholder="Mô tả..."
                                        value={item.MoTa}
                                        onChangeText={(text) => this.ChangeFile(text, index, 'mota')}
                                        onBlur={() => this.EditFile(item)}
                                    />
                                    <TouchableOpacity onPress={() => this.setState({ isChangeFileMoTa: index })}>
                                        <Image
                                            style={{ marginLeft: 0, marginTop: 12, marginRight: 27, height: 15, width: 14 }}
                                            source={require('../../assets/icons/edit.png')}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.DeleteOutputFile(item)}>
                                        <Image
                                            style={{ marginLeft: 0, marginTop: 12, marginRight: 16, height: 15, width: 14 }}
                                            source={require('../../assets/icons/Trash.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={[{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }]}>

                                    <TouchableOpacity onPress={() => this.download(item)} style={[{ marginLeft: 16, height: 40, marginRight: 24, flex: 1 }]}>
                                        <Text style={[{ lineHeight: 40 }]}>
                                            {item.FileName}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.TakePhoto(item)}>
                                        <Text
                                            style={{ marginLeft: 16, lineHeight: 40, marginRight: 16, color: '#0092FF' }}
                                        > Tải lên</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        }
                        maxToRenderPerBatch={1}
                        windowSize={5}
                        onEndReachedThreshold={0.5}
                        removeClippedSubviews={true}
                        disableVirtualization={true}
                        maxToRenderPerBatch={1}
                        initialNumToRender={5}
                    />
                </View>



            </View>
        )
    }
}
const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: "white",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
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
