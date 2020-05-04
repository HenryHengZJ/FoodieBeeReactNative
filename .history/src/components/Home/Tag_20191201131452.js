import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import colors from '../../styles/colors';
import PropTypes from 'prop-types';

class Tag extends Component {
    render() {
        return (
            <View style={{ minHeight: 20, minWidth: 40, paddingVertical: 10, paddingHorizontal: 15, backgroundColor: colors.themeblue, borderColor: 'transparent', borderWidth: 1, borderRadius: 25, marginRight: 5 }}>
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 12 }}>{this.props.name}</Text>
                <TouchableOpacity
                    style={{ 
                        position:'absolute', 
                        left:20, 
                        top:50, 
                        zIndex:10,
                        padding:10, 
                        height: 40,
                        width: 40,
                        borderRadius:20,
                        alignItems:'center',
                        justifyContent:'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                        onPress={this.props.handleButtonPress}
                >
                <Image
                    style={{ 
                    height: 15,
                    width: 15,
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
    handleButtonPress: PropTypes.func.isRequired,
};
  