import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import colors from '../../styles/colors';

class Tag extends Component {
    render() {
        return (
            <View 
           
            style={{ minHeight: 20, minWidth: 40, paddingVertical: 10, paddingHorizontal: 15, backgroundColor: this.props.valueSet ? colors.themeblue : 'white', borderColor: this.props.valueSet ? 'transparent' : '#dddddd', borderWidth: 1, borderRadius: 25, marginRight: 5 }}>
                <Text style={{ color:  this.props.valueSet ? 'white' : 'grey', fontWeight: '700', fontSize: 12 }}>{this.props.name}</Text>
            </View>
        );
    }
}
export default Tag;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});