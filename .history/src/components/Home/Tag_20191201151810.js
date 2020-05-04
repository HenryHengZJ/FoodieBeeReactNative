import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from "react-native";
import colors from '../../styles/colors';
import PropTypes from 'prop-types';
const closeIcon = require('../../img/close-button.png');

class Tag extends Component {
    render() {
        return (
            <View style={{ minHeight: 20, minWidth: 40, paddingVertical: 10, paddingLeft: 15, backgroundColor: colors.themeblue, borderColor: 'transparent', borderWidth: 1, borderRadius: 25, marginRight: 5, flexDirection: 'row' }}>
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 12 }}>{this.props.name}</Text>
                <TouchableOpacity
                    style={{ 
                        marginLeft: 7,
                        padding: 7, 
                        paddingRight: 10,
                        height: 12,
                        width: 12,
                        alignItems:'center',
                        justifyContent:'center',
                        alignSelf: 'center',
                        backgroundColor: 'transparent'}}
                        onPress={this.props.handleButtonPress}
                >
                <Image
                    style={{ 
                        height: 12,
                        width: 12,
                        alignSelf: 'center',
                        justifyContent:'center',
                    }}
                    source={closeIcon}
                />
            
                </TouchableOpacity>
            </View>
        );
    }
}
export default Tag;

Tag.propTypes = {
    name: PropTypes.string,
    handleButtonPress: PropTypes.func.isRequired,
};
  