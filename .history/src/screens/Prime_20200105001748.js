
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
        customerIsPrime: true,
        };
    }
    
    renderView() {

        return (
        <View>
    
            <View style={{ height: 250, width: '100%', backgroundColor: colors.backgroundblue}}/>

            <View style={{ marginTop: -180, marginLeft:20, marginRight:20, alignItems: 'center', alignSelf: 'center', flexDirection: 'row'}}>

                <Text style={{ color: 'white', fontWeight: '700', fontSize: 35}}>
                FoodieBee
                </Text>

                <View 
                style={{
                    padding: 7,
                    backgroundColor: '#FF5722',
                    borderRadius: 5,
                    marginLeft: 10,
                }}>
                    <Text style={{ color: 'white', fontWeight: '500', fontSize: 20 }}>PRIME</Text>
                </View>


            </View>

            <View 
                style={{ 
                borderLeftWidth: 0, 
                borderRightWidth: 0, 
                borderTopWidth: 0,
                borderBottomWidth: 1,
                borderColor: '#dddddd', 
                borderRadius:5,
                shadowColor: '#000',
                shadowOffset: {
                    width: 1,
                    height: 1,
                },
                shadowOpacity: 0.3,
                justifyContent:'center',
                elevation:2,backgroundColor: 'white', marginLeft: 20, marginRight: 20, marginTop: 30, paddingBottom: 30}}>

                <View style={{ marginTop:20, marginLeft:20, marginRight:20, flexDirection: 'column'}}>

                <Text style={{ alignSelf: 'center', color: colors.greyBlack, fontWeight: '700', marginTop:10, fontSize: 24, opacity: 0.9}}>
                    Get lunch from just €6
                </Text>

                <Text style={{ alignSelf: 'center', textAlign: 'center', color: colors.greyBlack, fontWeight: '500', lineHeight: 25, marginTop:10, fontSize: 16, opacity: 0.7}}>
                    You can save much more by subscribing to prime membership
                </Text>

                </View>

                <View style={{ marginTop: 20, marginBottom: 20, marginLeft:20, marginRight:20, flexDirection: 'column'}}>

                <View style={{ flexDirection: 'row', marginTop: 10  }}>
                    <Image
                        style={{ justifyContent:'center', alignSelf:'center', height: 30, width: 30, }}
                        source={{uri: img.checked}}
                    />

                    <Text style={{color: 'black', flex: 1, justifyContent: 'center', alignSelf: 'center', marginLeft: 20, lineHeight: 25, fontSize: 15 }} >
                        Free trial for 1 month. Cancel anytime
                    </Text>

                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Image
                        style={{ justifyContent:'center', alignSelf:'center', height: 30, width: 30, }}
                        source={{uri: img.checked}}
                    />

                    <Text style={{color: 'black', flex: 1, justifyContent: 'center', alignSelf: 'center', marginLeft: 20, lineHeight: 25, fontSize: 15 }} >
                        €6 and €10 meals daily
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10  }}>
                    <Image
                        style={{ justifyContent:'center', alignSelf:'center', height: 30, width: 30, }}
                        source={{uri: img.checked}}
                    />

                    <Text style={{color: 'black', flex: 1, justifyContent: 'center', alignSelf: 'center', marginLeft: 20, lineHeight: 25, fontSize: 15 }} >
                        No commitment. Order when you like
                    </Text>
                </View>

                </View>

                <View style={{ paddingLeft:15 , paddingRight:15 , flexDirection: 'column', marginTop: 20 }}>

                <TouchableOpacity
                    style={{ 
                    borderLeftWidth: 0, 
                    borderRightWidth: 0, 
                    borderTopWidth: 0,
                    borderBottomWidth: 1,
                    borderColor: '#dddddd', 
                    borderRadius:25,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 1,
                        height: 1,
                    },
                    shadowOpacity: 0.3,
                    justifyContent:'center',
                    elevation:2,
                    backgroundColor: colors.priceblue}}
                    >
                        <Text style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15, alignSelf: 'center', color: 'white', fontWeight: '500', fontSize: 17}}>
                            Start Free Trial Now
                        </Text>

                </TouchableOpacity>

                <Text style={{ marginTop: 20, alignSelf: 'center', marginLeft: 20, marginRight: 10, color: 'black', fontWeight: '500', fontSize: 15}}>
                    <Text>Only</Text>
                    <Text style={{fontSize: 20, color: "#FF5722", fontWeight:'700'}}> €4.99 </Text>
                    <Text>per month after free trial</Text>
                </Text>

                </View>

            </View>

        </View>
        );
    }

    render() {

        return (

        <View style={{backgroundColor:'white', flex:1}}>

            {this.renderView()}

        </View>

        );
    }
}
