
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ScrollView,
  BackHandler,
  Platform,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Modal,
  Alert,
  TextInput,
  Picker
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import colors from '../styles/colors';
import apis from '../apis';
import img from '../img/s3'

const androidwhiteBackIcon = require('../img/android_back_white.png');
const ioswhiteBackIcon = require('../img/ios_back_white.png');

export default class Prime extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            customerEmail: "",
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const customerEmail = navigation.getParam('customerEmail');
        this.setState({
            customerEmail,
        }); 
    }

    render() {

        return (

        <WebView
            source={{uri: `http://localhost:5000/mobileaddpayment?customerEmail=${this.state.customerEmail}`}}
            style={{marginTop: 20}}
        />

        );
    }
}
