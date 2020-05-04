
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


import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ActionCreators from '../redux/actions';
import deviceStorage from '../helpers/deviceStorage';
import colors from '../styles/colors';
import apis from '../apis';
import img from '../img/s3'

class Prime extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            customerIsPrime: true,
        };
    }

    fetchUserData = () => {

        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.getJWTToken.jwttoken + " Refresh " + this.props.getRefreshToken.refreshtoken,
          }
      
          var url = apis.GETcustomerprofile
      
          axios({method: 'get', url: url, headers: headers})
          .then((response) => {
              if (response.headers['x-auth'] !== 'undefined') {
                  deviceStorage.saveItem("jwttoken", response.headers['x-auth']);
                  this.props.setJWT(response.headers['x-auth'])
              }
              if (response.status === 200) {
                  this.setState({
                    customerFirstName: typeof response.data[0].customerFirstName !== 'undefined' ? response.data[0].customerFirstName : "",
                    customerLastName: typeof response.data[0].customerLastName !== 'undefined' ? response.data[0].customerLastName : "",
                    customerEmail: typeof response.data[0].customerEmail !== 'undefined' ? response.data[0].customerEmail : "",
                    customerPhoneNumber: typeof response.data[0].customerPhoneNumber !== 'undefined' ? response.data[0].customerPhoneNumber : "",
                    customerCity: typeof response.data[0].customerCity !== 'undefined' ? response.data[0].customerCity : "",
                    customerCounty: typeof response.data[0].customerCounty !== 'undefined' ? response.data[0].customerCounty : "",
                    loadingVisible: false,
                  })
              }
          })
          .catch(err => {
              this.setState({
                loadingVisible: false,
              })
          });
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


const mapStateToProps = state => ({
    getJWTToken: state.getJWTToken,
    getRefreshToken: state.getRefreshToken,
    getUserid: state.getUserid,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

Prime.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Prime);
