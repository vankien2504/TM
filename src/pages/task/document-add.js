import React, { Component } from "react";
import { Linking, AsyncStorage, FlatList, TouchableOpacity, Image, View, Dimensions, style, TextInput, Text, Button, CheckBox, Alert, StyleSheet } from "react-native";
const GLOBAL = require('../../share/global.js');
import TaskService from "../../share/services/task.service";
import pick from "../../share/customize/image-picker";
import RNFetchBlob from 'react-native-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchBar from 'react-native-material-design-searchbar';
export default class DocumentAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.navigation.state.params.params,
            type: this.props.navigation.state.params.type,
            isInput: this.props.navigation.state.params.isInput,
            description: '',
            newLink: '',
            isAddLink: false,
            NewFileName: '',
            avatarSource: '',
            FileName: '',
            outputList: [],
            outputCalendarList: [],
            outputLinkList: [],
            outputFileList: [],

            inputList: [],

            responsePickPhoto: {},

            outputTotal: 0,
            outputCalendarTotal: 0,
            outputFileTotal: 0,
            outputLinkTotal: 0,

            isChangeCalendar: -1,
            isChangeLink: -1,
            isChangeLinkMoTa: -1,

            isChangeFileMoTa: -1
        }
    }
    BackPage() {
        this.props.navigation.state.params.onGoBack(this.state.task);
        this.props.navigation.goBack();
    }
    componentDidMount() {
        this.OutputList();
        this.InputList();
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
    AddOutputFile(IDKetQua, IDCongViec, URL, MoTa) {

        let params = { "ID": 0, "Type": 2, "IDKetQua": IDKetQua, "IDCongViec": IDCongViec, "MoTa": MoTa, "URL": URL, "uid": "", "isEdit": false };
        TaskService.ThemMoiFileTaiLieuTheoLink(params).then((res) => {
            let outputFileObject = JSON.parse(res)
            this.BackPage();
        });
    }
    Upload(response, item) {

        var dataAsFormData = new FormData();
        var fd = response.data.replace(/^data:image\/png;base64,/, "");
        debugger
        dataAsFormData.append("base64", fd);
        dataAsFormData.append("IDKhachHang", GLOBAL.userInfo.IDCongTy.toString());
        dataAsFormData.append("username", GLOBAL.userInfo.UserName);
        dataAsFormData.append("IDCongViec", item.IDCongViec.toString());
        dataAsFormData.append("MoTa", item.MoTa.toString());
        dataAsFormData.append("IDKetQua", item.IDKetQua.toString());
        dataAsFormData.append("IDNhanSuTao", GLOBAL.userInfo.IDNhanSu.toString());
        // TaskService.XoaFileDinhKem(item).then((res) => {
        TaskService.ThemMoi_UploadFileHinhDuLieuBase64(dataAsFormData).then((res) => {
            let fileObject = JSON.parse(res)
            this.BackPage();
            // this.OutputList();
        });
        // });
        this.setState({ avatarSource: response.uri })
    }
    TakePhoto() {
        pick(response => this.setState({ responsePickPhoto: response, FileName: response.fileName }));
    }
    OutputAdd() {
        if (this.state.type == 'lich') {
            if (this.state.isInput) {
                this.OutputCalendarAdd(0);
            } else {
                this.OutputCalendarAdd(1);
            }
        }
        if (this.state.type == 'link') {
            if (!this.state.isInput) {
                var outputLink = undefined;
                this.state.outputList.forEach(element => {
                    if (element.LoaiKetQua == 2) {
                        outputLink = element;
                    }
                });

                if (outputLink) {
                    this.AddOutputFile(outputLink.ID, this.state.task.ID, this.state.newLink, this.state.description);
                } else {
                    let params = { "ID": 0, "IDCongViec": this.state.task.ID, "LoaiKetQua": 2, "MoTa": 'Mô tả default', Sort: 0, "Type": 1, isValid: false, listFile: [], "uid": "" };
                    TaskService.ThemMoiCongViec_KetQuaDauRa(params).then((res) => {
                        let outputFileObject = JSON.parse(res);
                        this.AddOutputFile(outputFileObject.Data[0].ID, this.state.task.ID, this.state.newLink, this.state.description);

                    });
                }
            } else {
                var inputLink = undefined;
                this.state.inputList.forEach(element => {
                    if (element.LoaiKetQua == 2) {
                        inputLink = element;
                    }
                });

                if (inputLink) {
                    this.AddOutputFile(inputLink.ID, this.state.task.ID, this.state.newLink, this.state.description);
                } else {
                    let params = { "ID": 0, "IDCongViec": this.state.task.ID, "LoaiKetQua": 2, "MoTa": 'Mô tả default', Sort: 0, "Type": 0, isValid: false, listFile: [], "uid": "" };
                    TaskService.ThemMoiCongViec_KetQuaDauRa(params).then((res) => {
                        let outputFileObject = JSON.parse(res);
                        this.AddOutputFile(outputFileObject.Data[0].ID, this.state.task.ID, this.state.newLink, this.state.description);

                    });
                }
            }

        }
        if (this.state.type == 'file') {
            if (!this.state.isInput) {
                var outputFile = undefined;
                this.state.outputList.forEach(element => {
                    if (element.LoaiKetQua == 0) {
                        outputFile = element;
                    }
                });

                if (outputFile) {
                    this.Upload(this.state.responsePickPhoto, { IDCongViec: this.state.task.ID, IDKetQua: outputFile.ID, MoTa: this.state.description });

                    // this.AddOutputFile(outputFile.ID, this.state.task.ID, this.state.newLink, this.state.description);
                } else {
                    let params = { "ID": 0, "IDCongViec": this.state.task.ID, "LoaiKetQua": 0, "MoTa": 'Mô tả default', Sort: 0, "Type": 1, isValid: false, listFile: [], "uid": "" };
                    TaskService.ThemMoiCongViec_KetQuaDauRa(params).then((res) => {
                        let outputFileObject = JSON.parse(res);
                        this.Upload(this.state.responsePickPhoto, { IDCongViec: this.state.task.ID, IDKetQua: outputFileObject.Data[0].ID, MoTa: this.state.description });

                        // this.AddOutputFile(outputFileObject.Data[0].ID, this.state.task.ID, this.state.newLink, this.state.description);

                    });
                }

            } else {
                var inputFile = undefined;
                this.state.inputList.forEach(element => {
                    if (element.LoaiKetQua == 0) {
                        inputFile = element;
                    }
                });

                if (inputFile) {
                    this.Upload(this.state.responsePickPhoto, { IDCongViec: this.state.task.ID, IDKetQua: inputFile.ID, MoTa: this.state.description });

                    // this.AddOutputFile(outputFile.ID, this.state.task.ID, this.state.newLink, this.state.description);
                } else {
                    let params = { "ID": 0, "IDCongViec": this.state.task.ID, "LoaiKetQua": 0, "MoTa": 'Mô tả default', Sort: 0, "Type": 0, isValid: false, listFile: [], "uid": "" };
                    TaskService.ThemMoiCongViec_KetQuaDauRa(params).then((res) => {
                        let outputFileObject = JSON.parse(res);
                        this.Upload(this.state.responsePickPhoto, { IDCongViec: this.state.task.ID, IDKetQua: outputFileObject.Data[0].ID, MoTa: this.state.description });

                        // this.AddOutputFile(outputFileObject.Data[0].ID, this.state.task.ID, this.state.newLink, this.state.description);

                    });
                }
            }
        }
        this.BackPage();
    }

    OutputCalendarAdd(type) {

        let params = { "ID": 0, "IDCongViec": this.state.task.ID, "LoaiKetQua": 1, "MoTa": this.state.description, Sort: 0, "Type": type, isValid: false, listFile: [], "uid": "" };
        TaskService.ThemMoiCongViec_KetQuaDauRa(params).then((res) => {
            let outputFileObject = JSON.parse(res);
            this.BackPage();
        });
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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 54, flex: 1 }}>
                        {this.state.type == 'lich' ? 'Thêm lịch hẹn' : this.state.type == 'link' ? 'Thêm liên kết' : 'Thêm file đính kèm'}
                    </Text>
                    <TouchableOpacity onPress={() => this.OutputAdd()}>
                        <Text style={{ fontSize: 15, color: '#0092FF', lineHeight: 54, marginRight: 16 }}>
                            Tạo
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>

                    <View style={{ height: 40, flexDirection: 'row' }}>
                        <Text style={{ marginLeft: 16, flex: 1, lineHeight: 40, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            Mô tả
                    </Text>
                    </View>

                </View>

                <TextInput
                    style={[{ backgroundColor: '#FFF', textDecorationLine: 'underline', fontSize: 15, lineHeight: 49, padding: 0, height: 98, margin: 0, paddingLeft: 16 }]}
                    multiline={true}
                    placeholder="Mô tả..."
                    clearButtonMode="always"
                    value={this.state.description}
                    onChangeText={(text) => this.setState({ description: text })}
                />
                <View style={this.state.type == 'link' ? { display: 'flex' } : { display: 'none' }}>
                    <View style={{ height: 40, flexDirection: 'row' }}>
                        <Text style={{ marginLeft: 16, flex: 1, lineHeight: 40, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            Liên kết
                    </Text>
                    </View>
                    <SearchBar
                        onSearchChange={text => this.setState({ newLink: text })}
                        height={40}
                        iconSearchComponent={<View></View>}
                        iconBackComponent={<View></View>}
                        onFocus={() => console.log('On Focus')}
                        onBlur={() => console.log('On Blur')}
                        placeholder={'Mô tả...'}
                        inputStyle={{ padding: 0, paddingLeft: 0, borderRadius: 3, backgroundColor: '#FFF', borderColor: "#FFF" }}
                        textStyle={{ padding: 0, paddingLeft: 16, fontFamily: "Muli", fontSize: 15, color: "#5d5d5d", backgroundColor: '#FFF' }}
                        padding={0}
                        iconColor={'#5d5d5d'}
                        autoCorrect={false}
                        returnKeyType={'search'}
                    />
                </View>
                <View style={this.state.type == 'file' ? { display: 'flex' } : { display: 'none' }}>
                    <View style={{ height: 40, flexDirection: 'row' }}>
                        <Text style={{ marginLeft: 16, flex: 1, lineHeight: 40, fontFamily: 'Muli', fontSize: 15, fontWeight: 'bold', color: '#5d5d5d' }}>
                            File đính kèm
                    </Text>
                    </View>
                    <View style={[{ height: 40, flexDirection: 'row', backgroundColor: '#FFF', borderBottomColor: '#c3c3c3', borderBottomWidth: 1 }]}>

                        <TouchableOpacity style={[{ marginLeft: 16, height: 40, marginRight: 24, flex: 1 }]}>
                            <Text style={[{ lineHeight: 40 }]} numberOfLines={1}>
                                {this.state.FileName}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.TakePhoto()}>
                            <Text
                                style={{ marginLeft: 16, lineHeight: 40, marginRight: 16, color: '#0092FF' }}
                            > Tải lên</Text>
                        </TouchableOpacity>
                    </View>
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
