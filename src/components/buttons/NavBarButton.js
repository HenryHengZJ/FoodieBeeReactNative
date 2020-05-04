
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default class NavBarButton extends Component {
  render() {
  	const {
      location, 
      text, 
      color, 
      icon, 
      handleButtonPress,
    } = this.props;

  	const marginPosition = location === 'right' ? { marginRight: 0 } : { marginLeft: 0 };
    
    let content;

  	if (text) {
  	  content = (
        <Text style={[{ color }, marginPosition, styles.buttonText]}>
          {text}
        </Text>
      );
    }
    else if (icon) {
  	  content = (
    <View style={[{ color }, marginPosition, styles.buttonText]}>
      {icon}
    </View>
      );
    }
    
    return (
      <TouchableOpacity onPress={handleButtonPress}>
        {content}
      </TouchableOpacity>
    );
  }
}

NavBarButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.object,
  handleButtonPress: PropTypes.func.isRequired,
  location: PropTypes.string,
  color: PropTypes.string,
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    padding:20,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
