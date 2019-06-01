import React, { Component } from "react";
import { Linking, AsyncStorage, FlatList, TouchableOpacity, Image, View, Dimensions, style, TextInput, Text, Button, CheckBox, Alert, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
const GLOBAL = require('../../share/global.js');
import TaskService from "../../share/services/task.service";
import CheckboxModest from 'react-native-modest-checkbox'
import pick from "../../share/customize/image-picker";
import RNFetchBlob from 'react-native-fetch-blob';
import FileViewer from 'react-native-file-viewer';
export default class DocumentDetail1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.navigation.state.params.params,

            isChangeLink: false,
            isAddLink: false,
            NewFileName: '',
            avatarSource: '',

            outputList: [],
            outputTotal: 0,
            outputCalendarTotal: 0,
            outputFileTotal: 0,
            outputLinkTotal: 0,

            isChangeCalendar: -1,
        }
    }
    BackPage() {
        this.props.navigation.state.params.onGoBack(this.state.task);
        this.props.navigation.goBack();
    }
    componentWillMount() {

    }
    OutputList() {
        let param = { "Page": 1, "PageSize": 50, "Filter": "IDCongViec~eq~" + this.state.task.ID + "~and~Type~eq~1", "Sort": "" };
        TaskService.LayDanhKetQuaDauRa(param).then((res) => {
            let outputObject = JSON.parse(res)
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
    Upload(response) {
        var dataAsFormData = new FormData();
        var fd = response.data.replace(/^data:image\/png;base64,/, "");

        dataAsFormData.append("base64", fd);
        dataAsFormData.append("IDKhachHang", GLOBAL.userInfo.IDCongTy.toString());
        dataAsFormData.append("username", GLOBAL.userInfo.UserName);
        dataAsFormData.append("IDCongViec", this.state.output.IDCongViec.toString());
        dataAsFormData.append("IDKetQua", this.state.output.ID.toString());
        dataAsFormData.append("IDNhanSuTao", GLOBAL.userInfo.IDNhanSu.toString());

        TaskService.ThemMoi_UploadFileHinhDuLieuBase64(dataAsFormData).then((res) => {
            let fileObject = JSON.parse(res)
            this.state.output.listFile.unshift(fileObject.Data[0]);
            this.setState({ output: this.state.output });
        });

        this.setState({ avatarSource: response.uri })
    }
    TakePhoto() {
        pick(response => this.Upload(response));
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
    EditCarlendar(item, index) {
        let params = item;
        this.state.outputList[index] = item;
        this.setState({
            outputList: this.state.outputList,
            isChangeCalendar: false
        });
        TaskService.CapNhatKetQuaDauRa(params).then((res) => {
            let outputObject = JSON.parse(res)
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
    DeleteOutputFile(index) {

        let params = this.state.output.listFile[index];
        TaskService.XoaFileDinhKem(params).then((res) => {
            let outputObject = JSON.parse(res)
            this.state.output.listFile.splice(index, 1);
            this.CountLinkTotal();
            this.setState({
                output: this.state.output
            });
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
    ChangeLink(text, index) {
        this.state.output.listFile[index].URL = text;
        this.setState({
            output: this.state.output
        });

    }
    ChangeCalendar() {
        this.state.outputList[index].MoTa = text;
        this.setState({
            outputList: this.state.outputList
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
                    <View style={{ height: 54 }}>
                        <Text style={{ lineHeight: 16, height: 16, marginTop: 9 }}>
                            Kết quả đầu ra
                        </Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', lineHeight: 19, height: 19 }}>
                            {this.state.outputList.MoTa}
                        </Text>
                    </View>
                </View>
                <View style={{ height: 40, flexDirection: 'row' }}>
                    <Image
                        style={{ marginTop: 10, marginLeft: 16, marginRight: 12, width: 19, height: 20 }}
                        source={require('../../assets/icons/Calendar.png')}
                    />
                    <Text style={{ flex: 1, lineHeight: 40, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                        Lịch hẹn ()
                    </Text>
                    <TouchableOpacity onPress={() => this.setState({ isAddLink: true })}>
                        <Text
                            style={{ marginTop: 11, marginLeft: 10, marginRight: 16, color: '#0092FF' }}
                        >
                            + thêm lịch hẹn
                    </Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={this.state.outputList}
                    extraData={this.state}
                    keyExtractor={(item) => item.ID.toString()}
                    renderItem={({ item, index }) =>
                        <View style={[{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }, item.LoaiKetQua == 1 ? { display: 'flex' } : { display: 'none' }]}>
                            <TouchableOpacity style={[{ marginLeft: 16, height: 40, marginRight: 24, flex: 1 }, !this.state.isChangeCalendar == index ? { display: 'flex' } : { display: 'none' }]}>
                                <Text style={[{ lineHeight: 40, color: '#0092FF' }]}>
                                    {this.state.outputList.listFile[index].URL}
                                </Text>
                            </TouchableOpacity>
                            <TextInput
                                style={[{ padding: 0, flex: 1, padding: 0, margin: 0, marginLeft: 16, marginRight: 24, height: 40 }, this.state.isChangeCalendar == index ? { display: 'flex' } : { display: 'none' }]}
                                placeholder="Mô tả..."
                                value={this.state.outputList.MoTa}
                                onChangeText={(text) => this.ChangeCalendar(text, index)}
                                onBlur={() => this.EditCarlendar(index)}
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
                    contentContainerStyle={{ paddingBottom: 120 }}
                />

                <View>
                    <View style={{ height: 40, flexDirection: 'row' }}>
                        <Image
                            style={{ marginTop: 10, marginLeft: 16, marginRight: 12, width: 20, height: 20 }}
                            source={require('../../assets/icons/link.png')}
                        />
                        <Text style={{ lineHeight: 40, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            Liên kết <Text style={{ fontWeight: 'normal' }}>({this.state.outputLinkTotal})</Text>
                        </Text>
                        <TouchableOpacity onPress={() => this.setState({ isAddLink: true })}>
                            <Text
                                style={{ marginTop: 11, marginLeft: 10, marginRight: 16, color: '#0092FF' }}
                            >
                                + thêm liên kết
                    </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 80, backgroundColor: '#FFF' }}>
                        <View style={[{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }, this.state.isAddLink ? { display: 'flex' } : { display: 'none' }]}>
                            <TextInput
                                style={[{ padding: 0, flex: 1, padding: 0, margin: 0, marginLeft: 16, marginRight: 24, textAlignVertical: 'center', height: 40 }]}
                                placeholder="Nhập link..."
                                value={this.state.NewFileName}
                                onChangeText={(text) => this.setState({ NewFileName: text })}
                                onBlur={() => this.AddOutputFile()}
                            />
                            <TouchableOpacity onPress={() => this.setState({ isChangeLink: !this.state.isChangeLink })}>
                                <Image
                                    style={{ marginLeft: 0, marginTop: 12, marginRight: 27, height: 15, width: 14 }}
                                    source={require('../../assets/icons/edit.png')}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.DeleteOutputFile()}>
                                <Image
                                    style={{ marginLeft: 0, marginTop: 12, marginRight: 16, height: 15, width: 14 }}
                                    source={require('../../assets/icons/Trash.png')}
                                />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            style={{ flex: 1 }}
                            data={this.state.outputList}
                            extraData={this.state}
                            keyExtractor={(item) => item.ID.toString()}
                            renderItem={({ item, index }) =>
                                <View style={[{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }, item.LoaiKetQua == 2 ? { display: 'flex' } : { display: 'none' }]}>
                                    <FlatList
                                        style={{ flex: 1 }}
                                        data={item.listFile}
                                        extraData={this.state}
                                        keyExtractor={(item) => item.ID.toString()}
                                        renderItem={({ item, index }) =>
                                            <View>
                                                <TouchableOpacity style={[{ marginLeft: 16, height: 40, marginRight: 24, flex: 1 }, !this.state.isChangeLink == index ? { display: 'flex' } : { display: 'none' }]} onPress={() => Linking.openURL(item.URL)}>
                                                    <Text style={[{ lineHeight: 40, color: '#0092FF' }]}>
                                                        {item.URL}
                                                    </Text>
                                                </TouchableOpacity>
                                                <TextInput
                                                    style={[{ padding: 0, flex: 1, padding: 0, margin: 0, marginLeft: 16, marginRight: 24, height: 40 }, this.state.isChangeLink ? { display: 'flex' } : { display: 'none' }]}
                                                    placeholder="Nhập link..."
                                                    value={item.URL}
                                                    onChangeText={(text) => this.ChangeLink(text, index)}
                                                    onBlur={() => this.EditOutputFile(index)}
                                                />
                                                <TouchableOpacity onPress={() => this.setState({ isChangeLink: !this.state.isChangeLink })}>
                                                    <Image
                                                        style={{ marginLeft: 0, marginTop: 12, marginRight: 27, height: 15, width: 14 }}
                                                        source={require('../../assets/icons/edit.png')}
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this.DeleteOutputFile(index)}>
                                                    <Image
                                                        style={{ marginLeft: 0, marginTop: 12, marginRight: 16, height: 15, width: 14 }}
                                                        source={require('../../assets/icons/Trash.png')}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    />
                                </View>
                            }
                        />
                    </View>
                </View>

                <View style={this.state.outputList.LoaiKetQua == 0 ? { display: 'flex' } : { display: 'none' }}>
                    <View style={{ height: 40, flexDirection: 'row' }}>
                        <Image
                            style={{ marginTop: 10, marginLeft: 16, marginRight: 12, width: 20, height: 21 }}
                            source={require('../../assets/icons/attach.png')}
                        />
                        <Text style={{ lineHeight: 40, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            File đính kèm <Text style={{ fontWeight: 'normal' }}>({this.state.outputFileTotal})</Text>
                        </Text>
                    </View>
                    <View style={{ height: 80, backgroundColor: '#FFF' }}>
                        <FlatList
                            data={this.state.outputList}
                            extraData={this.state}
                            keyExtractor={(item) => item.ID.toString()}
                            renderItem={({ item, index }) =>
                                <View style={[{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }, this.state.outputList.listFile[index].Type == 1 ? { display: 'flex' } : { display: 'none' }]}>
                                    <TouchableOpacity style={[{ marginLeft: 16, height: 40, marginRight: 24, flex: 1 }]} >
                                        <Text style={[{ lineHeight: 40, color: '#0092FF' }]}>
                                            {this.state.outputList.listFile[index].FileName}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.download(item)}>
                                        <Image
                                            style={{ marginLeft: 0, marginTop: 12, marginRight: 27, height: 13, width: 20 }}
                                            source={require('../../assets/icons/eye.png')}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.DeleteOutputFile(index)}>
                                        <Image
                                            style={{ marginLeft: 0, marginTop: 12, marginRight: 16, height: 15, width: 14 }}
                                            source={require('../../assets/icons/Trash.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            }
                        />
                    </View>
                    <View style={{ flexDirection: 'row', height: 40, backgroundColor: '#FFF' }}>
                        <View style={{ flex: 1 }}>

                        </View>
                        <TouchableOpacity onPress={() => this.TakePhoto()}>
                            <Text
                                style={{ marginTop: 11, marginLeft: 10, marginRight: 16, color: '#0092FF' }}
                            >
                                thêm file
                    </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Image source={this.state.avatarSource} style={{ height: 100, width: 300 }} />
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
