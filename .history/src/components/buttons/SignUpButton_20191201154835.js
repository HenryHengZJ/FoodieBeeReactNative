/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../../styles/colors';
import iPhoneSize from '../../helpers/utils';

const size = iPhoneSize();
const buttonSize = 60;
const buttonWrapperPadding = 0;

if (size === 'small') {
  buttonSize = 50;
  buttonWrapperPadding = 20;
}

export default class SignUpButton extends Component {
  render() {
  	const { disabled, handleNextButton } = this.props;
  	const opacityStyle = disabled ? 0.2 : 0.9;
    return (
      <View style={styles.buttonWrapper}>
      <TouchableHighlight
        disabled={disabled}
        style={{ 
            borderRadius:25,
            justifyContent:'center',
            opacity: opacityStyle,
            backgroundColor: colors.themeblue}}
            onPress={handleNextButton}
        >

        <View style={{ alignItems:'center', justifyContent:'center'}}>

          <Text style={{ paddingTop: 13, paddingBottom: 13, paddingLeft: 17, paddingRight: 17, color: 'white', fontWeight: '500', fontSize: 15}}>
            Sign Up Now
          </Text>

        </View>

      </TouchableHighlight>
      </View>
    );
  }
}

SignUpButton.propTypes = {
  disabled: PropTypes.bool,
  handleNextButton: PropTypes.func,
};

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: 'flex-end',
    right: 20,
    bottom: 20,
    paddingTop: buttonWrapperPadding,
    backgroundColor: 'transparent'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    width: buttonSize,
    height: buttonSize,
    backgroundColor: colors.themeblue,
  },
  icon: {
    marginRight: -2,
    marginTop: -2,
  },
});
