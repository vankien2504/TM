import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
const GLOBAL = require('../../share/global.js');
import TaskService from "../../share/services/task.service";
class Notify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifyList: []
        };
    }
    componentWillMount() {
        this.LayDanhSachThongBao();
    }

    LayDanhSachThongBao() {

        let param = { "Page": 2, "PageSize": 10, "Filter": "NotiUser~eq~'" + GLOBAL.userInfo.UserName + "'", "Sort": "NotiTime-desc" }
        debugger
        TaskService.LayDanhSachThongBao(param).then((res) => {
            let responseJson = JSON.parse(res)
            this.setState({
                notifyList: responseJson.result.Data
            })
        });
    }
    BackPage() {
        this.props.navigation.state.params.onGoBack(this.state.task, this.state.taskFatherBack);
        this.props.navigation.goBack();
    }
    render() {
        return (
            <View>
                <View style={[{ height: 62, flexDirection: 'row' }, styles.shadow]} >
                    <TouchableOpacity onPress={() => this.BackPage()}>
                        <Image
                            style={{ marginTop: 23, marginLeft: 10, marginRight: 12, height: 17, width: 9 }}
                            source={require('../../assets/icons/Arrow_left.png')}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 62 }}>
                        Thông báo
                        </Text>

                </View>
                <FlatList
                    data={this.state.notifyList}
                    extraData={this.state}
                    keyExtractor={(item) => item.AppId.toString()}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => this.setState({})}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    style={{ marginTop: 8, marginLeft: 16, marginRight: 16, height: 40, width: 40 }}
                                    source={require('../../assets/icons/document.png')}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text numberOfLines={2} style={{ marginTop: 8, fontWeight: 'bold' }}>
                                        {item.NoiDung}
                                    </Text>
                                    <Text style={{ marginTop: 3, color: '#5293B0' }}>
                                        {/* 24 phút trước */}
                                        {item.CreatedDate}
                                    </Text>
                                </View>

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
                    contentContainerStyle={{ paddingBottom: 120 }}
                />



            </View>
        );
    }
}
const styles = StyleSheet.create({
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
})
export default Notify;

