import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, StatusBar, Platform, ScrollView } from 'react-native'
import { PropTypes } from 'prop-types';

import apis from '../apis';
import deviceStorage from '../helpers/deviceStorage';
import ActionCreators from '../redux/actions';

import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

const account_mydetails = require('../img/account_mydetails.png');
const account_myorders = require('../img/account_myorders.png');
const account_payment = require('../img/account_payment.png');
const account_prime = require('../img/account_prime.png');
const account_logout = require('../img/account_logout.png');
const account_company = require('../img/account_company.png');
const account_review = require('../img/account_review.png');

const navigateToHomeAction = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'Home'})
    ] 
  })
class Account extends Component {

    constructor(props) {
        super(props);

        this.state = {
            subscriptionID: "ll"
        };

        this.deleteJWT = deviceStorage.deleteJWT.bind(this);
        this.deleteUserid = deviceStorage.deleteUserid.bind(this);
        this.deleteRefreshToken = deviceStorage.deleteRefreshToken.bind(this);

    }

    onCompanyAddressPressed = (navigation) => {
        navigation.navigate('CompanyAddress');
    } 

    onMyDetailsPressed = (navigation) => {
        navigation.navigate('MyDetails');
    }

    onPaymentMethodPressed = (navigation) => {
        navigation.navigate('PaymentMethod');
    }
  
    onPrimePressed = (navigation) => {
        navigation.navigate('Prime');
    }   

    onOrderPressed = (navigation) => {
        navigation.navigate('MyOrders');
    } 

    onReviewPressed = (navigation) => {
        navigation.navigate('Review');
    }

    onLogOutPressed = (navigation) => {
        var headers = {
            'Content-Type': 'application/json',
        }
      
        var url = apis.GETcustomerlogout;
        
        axios.get(url, {withCredentials: true}, {headers: headers})
        .then((response) => {
            if (response.status === 200) {
                this.deleteUserid();
                this.deleteJWT();
                this.deleteRefreshToken();
                this.props.setUID(undefined)
                this.props.setJWT(undefined)
                this.props.setRefreshToken(undefined)
                this.props.setcustomerHasOrderedToday(undefined)
                navigation.dispatch(navigateToHomeAction)
            }
        })
        .catch((error) => {

        });
          
    } 
 
    render () {
        return (
        <View style={{backgroundColor:'#F5F5F5', flex:1}}>
            <StatusBar backgroundColor='#ffffff' barStyle='dark-content' />
            <ScrollView>
                <TouchableOpacity
                style={{ 
                    marginTop: 20,
                    paddingTop:15,
                    paddingBottom:15,
                    paddingLeft:20,
                    paddingRight:20,
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#dddd'
                    }}
                    onPress={this.onOrderPressed.bind(this, this.props.navigation)} 
                >
                    <View style={{flexDirection: 'row'}}>
                        <Image
                        style={{ justifyContent:'center', alignSelf:'center', height: 25, width: 25, opacity: 0.6 }}
                        source={account_myorders}
                        />
                        <Text style={{ marginLeft:20, alignSelf: 'center', color: 'black', fontSize: 15}}>
                            My Orders
                        </Text>
                    </View>

                </TouchableOpacity>

                <View
                    style={{ 
                        marginTop: 20,
                        backgroundColor: 'white',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: '#dddd'
                    }}
                    >

                    <TouchableOpacity
                    style={{ 
                        paddingTop:15,
                        paddingBottom:15,
                        paddingLeft:20,
                        paddingRight:20,
                    }}
                    onPress={this.onMyDetailsPressed.bind(this, this.props.navigation)} 
                    >
                    <View style={{flexDirection: 'row'}}>
                        <Image
                        style={{ justifyContent:'center', alignSelf:'center', height: 25, width: 25, opacity: 0.6 }}
                        source={account_mydetails}
                        />
                        <Text style={{ marginLeft:20, alignSelf: 'center', color: 'black', fontSize: 15}}>
                            My Details
                        </Text>
                    </View>

                    </TouchableOpacity>

                    <TouchableOpacity
                    style={{ 
                        paddingTop:15,
                        paddingBottom:15,
                        paddingLeft:20,
                        paddingRight:20,
                    }}
                    onPress={this.onPrimePressed.bind(this, this.props.navigation)} 
                    >
                    <View style={{flexDirection: 'row'}}>
                        <Image
                        style={{ justifyContent:'center', alignSelf:'center', height: 25, width: 25, opacity: 0.6 }}
                        source={account_prime}
                        />
                        <View style={{flexDirection: 'column'}}>
                        <Text style={{ marginLeft: this.state.subscriptionID === "" ? 15 : 20, alignSelf: 'center', color: 'black', fontSize: 15}}>
                            FoodieBee Prime
                        </Text>
                        {this.state.subscriptionID === "" ?
                        <Text style={{ marginLeft:20, alignSelf: 'center', color: 'gray', fontSize: 13}}>
                            Free trial for 30 days
                        </Text> : null }
                        </View>
                    </View>

                    </TouchableOpacity>

                    <TouchableOpacity
                    style={{ 
                        paddingTop:15,
                        paddingBottom:15,
                        paddingLeft:20,
                        paddingRight:20,
                    }}
                    onPress={this.onPaymentMethodPressed.bind(this, this.props.navigation)} 
                    >
                    <View style={{flexDirection: 'row'}}>
                        <Image
                        style={{ justifyContent:'center', alignSelf:'center', height: 25, width: 25, opacity: 0.6 }}
                        source={account_payment}
                        />
                        <Text style={{ marginLeft:20, alignSelf: 'center', color: 'black', fontSize: 15}}>
                            Payment Methods
                        </Text>
                    </View>

                    </TouchableOpacity>

                    <TouchableOpacity
                    style={{ 
                        paddingTop:15,
                        paddingBottom:15,
                        paddingLeft:20,
                        paddingRight:20,
                    }}
                    onPress={this.onCompanyAddressPressed.bind(this, this.props.navigation)} 
                    >
                    <View style={{flexDirection: 'row'}}>
                        <Image
                        style={{ justifyContent:'center', alignSelf:'center', height: 25, width: 25, opacity: 0.6 }}
                        source={account_company}
                        />
                        <Text style={{ marginLeft:20, alignSelf: 'center', color: 'black', fontSize: 15}}>
                            Company Address
                        </Text>
                    </View>

                    </TouchableOpacity>

                    <TouchableOpacity
                    style={{ 
                        paddingTop:15,
                        paddingBottom:15,
                        paddingLeft:20,
                        paddingRight:20,
                    }}
                    onPress={this.onReviewPressed.bind(this, this.props.navigation)} 
                    >
                    <View style={{flexDirection: 'row'}}>
                        <Image
                        style={{ justifyContent:'center', alignSelf:'center', height: 25, width: 25, opacity: 0.6 }}
                        source={account_review}
                        />
                        <Text style={{ marginLeft:20, alignSelf: 'center', color: 'black', fontSize: 15}}>
                            Reviews
                        </Text>
                    </View>

                    </TouchableOpacity>

                </View>

                <TouchableOpacity
                style={{ 
                    marginTop: 20,
                    paddingTop:15,
                    paddingBottom:15,
                    paddingLeft:20,
                    paddingRight:20,
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#dddd'
                    }}
                    onPress={this.onLogOutPressed.bind(this, this.props.navigation)} 
                >
                    <View style={{flexDirection: 'row'}}>
                        <Image
                        style={{ justifyContent:'center', alignSelf:'center', height: 25, width: 25, opacity: 0.6 }}
                        source={account_logout}
                        />
                        <Text style={{ marginLeft:20, alignSelf: 'center', color: 'black', fontSize: 15}}>
                            Log out
                        </Text>
                    </View>

                </TouchableOpacity>

            </ScrollView>
            
        </View>
        )
    }
}

const mapStateToProps = state => ({
    getJWTToken: state.getJWTToken,
    getUserid: state.getUserid,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

Account.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setRefreshToken: PropTypes.func.isRequired,
  setcustomerHasOrderedToday: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);