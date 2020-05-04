import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback
} from "react-native";
import colors from '../../styles/colors';
import Touchable from 'react-native-platform-touchable';
import PropTypes from 'prop-types';

class Category extends Component {
    render() {
        const {
            handleOnPress,
        } = this.props;

        return (
            <View 
                style={{  
                    flex: 1,
                    marginLeft: 20, 
                    marginRight: Number.parseInt(this.props.rightmargin, 10),
                    backgroundColor: 'white',
                    height: 130, 
                    width: 130, 
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderTopWidth: 0,
                    borderBottomWidth: 1,
                    borderRadius: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 0.3,
                    borderColor: '#dddddd', 
                    elevation: 3}}>

                <Touchable 
                    style={{  
                        flex: 1,
                    }}
                    delayPressIn = {50000}
                    onPress={handleOnPress}
                    background={Touchable.Ripple(colors.ripplegray)}>

                    <View
                        style={{  
                            flex: 1,
                        }}>

                        <View style={{ flex: 2 }}>
                            <Image source={this.props.imageUri}
                                style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, flex: 1, width: null, height: null, resizeMode: 'cover' }}
                            />
                        </View>

                        <View style={{ flex: 1, paddingLeft: 10, paddingTop: 10 }}>
                            <Text style={{ color: colors.greyBlack, fontWeight: '500'}}>{this.props.name}</Text>
                        </View>

                    </View>

                </Touchable>

            </View>   
        );
    }
}
export default Category;

Category.propTypes = {
    handleOnPress: PropTypes.func,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});