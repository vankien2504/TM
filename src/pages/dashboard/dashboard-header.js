import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Execute from './execute';
import Monitor from './monitor';
class DashboardHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                { key: 'first', title: 'Tôi thực hiện' },
                { key: 'second', title: 'Tôi giám sát' },
            ],
        };
    }
    componentWillMount() {
        FourRoute = () => (
            <Execute navigation={this.props.navigation} callbackFromParent={this.myCallback} />
        );
        FiveRoute = () => (
            <Monitor navigation={this.props.navigation} callbackFromParent={this.myCallback} />
        );
    }
    changeIndex(index) {
        this.setState({ index: index })
    }
    render() {
        return (
            <View style={styles.scene}>

                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: FourRoute,
                        second: FiveRoute
                    })}

                    onIndexChange={(index) => this.changeIndex(index)}
                    initialLayout={{ width: Dimensions.get('window').width, height: 55 }}
                    renderTabBar={(props) =>
                        <TabBar
                            {...props}
                            getLabelText={({ route }) => route.title}
                            style={{ backgroundColor: "white" }}
                            labelStyle={{ fontWeight: 'bold' }}
                            activeColor={"#F1802E"}
                            inactiveColor={"#5D5D5D"}
                            indicatorStyle={{ backgroundColor: "#F1802E" }}
                        />
                    }
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    scene: {
        height: Dimensions.get('window').height,
        color: 'red'
    },
});
export default DashboardHeader;
