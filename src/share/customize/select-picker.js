import React from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    PanResponder,
    Animated,
    Easing,
    InteractionManager
} from 'react-native';
import { SelectPicker } from 'react-native-select-picker';
class CustomSelectPicker extends SelectPicker {
    constructor(props) {
        super(props);
    }
    _onScrollEnd = (gestureState, endTimestamp) => {
        var scrollY = this.scrollY + (gestureState.moveY - gestureState.y0);
        if (this.LastTimestamp > 0) {
            var speedY = scrollY + gestureState.vy * (endTimestamp - this.LastTimestamp) * 10;
            scrollY = speedY;
        }

        if (gestureState.moveY == 0) {
            scrollY = this.scrollY;
        }

        /* 判断 滚动的Y值 是否合法 */
        var minY = this.getMinScrollY();
        if (scrollY > 0) {
            scrollY = 0;
        }

        if (scrollY < minY) {
            scrollY = minY;
        }


        /* 定位到整个元素 */
        var resObj = this.getScrollYByCompelteItem(scrollY);

        scrollY = resObj.y;
        this.scrollY = scrollY;
        Animated.timing(
            this.state.animateValue,
            {
                toValue: scrollY,
                duration: 40,
                easing: Easing.ease,
                useNativeDriver: true
            }
        ).start();

        this.LastTimestamp = -1;
        /* 解决性能问题 */
        requestAnimationFrame(() => {
            this.props.onValueChange(this.props.data[resObj.index], resObj.index);
        });
    }

    scrollToNomalPx = () => {
        console.log('11');
        scrollY = this.scrollY;
        /* 判断 滚动的Y值 是否合法 */
        var minY = this.getMinScrollY();
        if (scrollY > 0) {
            scrollY = 0;
        }

        if (scrollY < minY) {
            scrollY = minY;
        }

        /* 定位到整个元素 */
        var resObj = this.getScrollYByCompelteItem(scrollY);

        scrollY = resObj.y;
        if (scrollY === this.scrollY) {
            // console.log(' 值合法 结束 ');
            return;
        }

        this.scrollY = scrollY;
        Animated.timing(
            this.state.animateValue,
            {
                toValue: scrollY,
                duration: 40,
                easing: Easing.ease,
                useNativeDriver: true
            }
        ).start();

        InteractionManager.runAfterInteractions(() => {
            console.log('12');
            this.props.onValueChange(this.props.data[resObj.index], resObj.index);
        });
    }
    render() {
        var { wrapHeight, wrapWidth, itemHeight, data, fontColor, fontSize, wrapStyle, maskercolor, borderStyle, IsAllDay, defaultValue } = this.props;
        var maskItemHeight = (wrapHeight - itemHeight) / 2;
        scrollY = this.scrollY;

        var selectedIndex = this.getScrollYByCompelteItem(scrollY).index;
        return (
            <View style={[styles.wrap, { height: wrapHeight, width: wrapWidth }, wrapStyle]}>

                <Animated.View
                    style={[{
                        overflow: 'hidden',
                        transform: [{ translateY: this.state.animateValue }]
                    }]}

                >
                    <View style={{ height: maskItemHeight, width: wrapWidth }} ></View>
                    {
                        data.map((item, index) => {
                            return <CustomItem fontSize={fontSize} IsAllDay={IsAllDay} defaultValue={defaultValue} selectedIndex={selectedIndex} fontColor={fontColor} style={{ alignItems: 'center', justifyContent: 'center', height: itemHeight, width: wrapWidth }} item={item} index={index} key={index} />
                        })
                    }
                    <View style={{ height: maskItemHeight, width: wrapWidth }} ></View>
                </Animated.View>

                <View style={[styles.masker]} {...this._panResponder.panHandlers}>

                    <View style={[styles.topItem, { height: maskItemHeight, width: wrapWidth, backgroundColor: maskercolor }, borderStyle]}></View>

                    <View style={[styles.bottomItem, { height: maskItemHeight, width: wrapWidth, backgroundColor: maskercolor }, borderStyle]}></View>

                </View>
            </View>
        )
    }
}

class CustomItem extends React.Component {
    render() {
        var { item, style, fontColor, fontSize, selectedIndex, index, IsAllDay, defaultValue } = this.props;

        return (
            <View style={style}>
                <Text style={[((defaultValue == item) && IsAllDay == false) ? { color: "#3498DB" } : { color: fontColor }, { textAlign: 'center', fontSize: fontSize }]}>{item}</Text>
            </View>
        )
    }
}
var styles = StyleSheet.create({
    wrap: {
        height: 100,
        width: 50,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'transparent'
    },
    scrollContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    masker: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'transparent'
    },
    topItem: {
        flex: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        // borderBottomColor: 'rgba(0,0,0,0.2)',
        // borderBottomWidth: 1,
    },
    bottomItem: {
        right: 0,
        left: 0,
        position: 'absolute',
        bottom: 0,
        // backgroundColor: 'rgba(255, 255, 255, 0.5)',
        // borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.2)'
    }
});

SelectPicker.defaultProps = {
    wrapHeight: 300,
    wrapWidth: null,
    itemHeight: 100,
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    fontColor: '#444',
    fontSize: 15,
    IsAllDay: true,
    defaultValue: '',
    wrapStyle: {},
    borderStyle: {},
    maskercolor: 'rgba(255, 255, 255, 0.5)',
    onValueChange: function (item, index) { },
}

export default CustomSelectPicker;