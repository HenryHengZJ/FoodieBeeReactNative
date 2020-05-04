
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  FlatList, 
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
  DeviceEventEmitter,
  BackHandler,
  AsyncStorage,
} from "react-native";

import { List,SearchBar, Card, ListItem, Button } from 'react-native-elements';
import colors from '../styles/colors';
import apis from '../apis';
import img from '../img/s3'
import deviceStorage from '../helpers/deviceStorage';

import Touchable from 'react-native-platform-touchable';
import moment from "moment";
import LottieView from 'lottie-react-native';
import { PropTypes } from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../redux/actions';
import ContentLoader from '@sarmad1995/react-native-content-loader';

class PaymentMethod extends Component {
 
    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            empty: false,
            loading: true,
            customerEmail: "",
            customerPaymentAccountID: "",
            paymentcarddetails: [],
            customerpaymentaccountdetails: [],
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {

        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.getJWTToken.jwttoken + " Refresh " + this.props.getRefreshToken.refreshtoken,
        }
      
        var url = apis.GETcustomerprofile;
        
        axios({method: 'get', url: url, headers: headers})
        .then((response) => {
            if (response.headers['x-auth'] !== 'undefined') {
                deviceStorage.saveItem("jwttoken", response.headers['x-auth']);
                this.props.setJWT(response.headers['x-auth'])
            }
            if (response.status === 200) {
                this.setState({
                  customerEmail: typeof response.data[0].customerEmail !== 'undefined' ? response.data[0].customerEmail : "",
                  customerPaymentAccountID: typeof response.data[0].customerPaymentAccountID !== 'undefined' ? response.data[0].customerPaymentAccountID : "",
                }, () => {
                  this.getCustomerPaymentAccount()
                })
              } 
        })
        .catch(err => {
            console.log("fetch error" + err);
            this.setState({
                loading: false,
                empty: true,
                refreshing: false,
            })
        });
    } 

    getCustomerPaymentAccount = () => {

        var headers = {
        'Content-Type': 'application/json',
        }

        var url = apis.GETcustomer_paymentaccount+ "?customerPaymentAccountID=" + this.state.customerPaymentAccountID;

        axios.get(url, {withCredentials: true}, {headers: headers})
        .then((response) => {
            if (response.status === 200) {
                console.log(response.data)
                this.setState({
                    customerpaymentaccountdetails: response.data,
                }, () => {
                    this.getCustomerCard()
                })
            } 
        })
        .catch((error) => {
            this.setState({
                loading: false,
                empty: true,
                refreshing: false,
            })
        });
    }
  

    getCustomerCard = () => {

        var headers = {
        'Content-Type': 'application/json',
        }

        var url = apis.GETcustomer_card+ "?customerPaymentAccountID=" + this.state.customerPaymentAccountID;

        axios.get(url, {withCredentials: true}, {headers: headers})
        .then((response) => {
            if (response.status === 200) {
            console.log(response.data.data)
            this.setState({
                paymentcarddetails: response.data.data,
                empty: response.data.data.length > 0 ? false : true,
                loading: false,
            })
            } 
        })
        .catch((error) => {
            this.setState({
                loading: false,
                empty: true,
                refreshing: false,
            })
        });
    }
  

    _renderItem = ({item, index}) => (

        <View style={{ margin: 15, borderWidth: 1, borderColor: '#ECECEC', padding:15, elevation:1, borderRadius: 10, backgroundColor: 'white' }}>

            <Image
                style={{ width: 50, height: 50,}}
                resizeMode={'cover'}
                source={{uri: item.card.brand === "visa" ? img.visa : item.card.brand === "mastercard" ? img.mastercard : item.card.brand === "amex" ? img.americanexpress : null}} />
        
            <Text numberOfLines={1} style={{ color: '#454545', fontSize: 17, fontWeight: 'bold' }}>
            {item.billing_details.name}</Text>

            <Text numberOfLines={1} style={{ color: 'black', paddingTop: 5, fontSize: 15 }}>
            &#9679;&#9679;&#9679;&#9679; {item.card.last4}</Text>

            <Text numberOfLines={1} style={{ color: 'black', paddingTop: 5, fontSize: 15 }}>
            {item.card.exp_month}/{item.card.exp_year}</Text>

            <View  style={{ flexDirection: 'row', marginTop: 15, marginBottom: 10 }}>
    
                <TouchableOpacity
                style={{ 
                    marginRight: 5,
                    borderRadius:5, 
                    flex:1,
                    paddingTop:10,
                    paddingBottom:10,
                    paddingLeft:15,
                    paddingRight:15,
                    justifyContent:'center',
                    elevation:3,
                    borderColor: this.state.customerpaymentaccountdetails.invoice_settings.default_payment_method === item.id ? 'transparent' : colors.green01,
                    backgroundColor: this.state.customerpaymentaccountdetails.invoice_settings.default_payment_method === item.id ? colors.green01 : 'white'}}
                >

                    <Text style={{ alignSelf: 'center', color: 'white', fontWeight: '500', fontSize: 17}}>
                    {this.state.customerpaymentaccountdetails.invoice_settings.default_payment_method === item.id ? "Default" : "Make Default"}
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity
                style={{ 
                    marginLeft: 5,
                    borderRadius:5, 
                    flex:1,
                    paddingTop:10,
                    paddingBottom:10,
                    paddingLeft:15,
                    paddingRight:15,
                    justifyContent:'center',
                    borderColor: 'red',
                    borderWidth: 1,
                    backgroundColor: 'white'}}
                >
                    <Text style={{ alignSelf: 'center', color: 'red', fontWeight: '500', fontSize: 17}}>
                        Delete
                    </Text>

                </TouchableOpacity>
    
            </View>
            
        </View>
       
    )

    renderLoadingView() {
        return (
            <View style={{ margin: 15, borderWidth: 1, borderColor: '#ECECEC', padding:15, elevation:1, borderRadius: 10, backgroundColor: 'white' }}>
     
                <ContentLoader
                    active 
                    title={false}
                    listSize={1}
                    pHeight={[20, 10, 10]}
                    pWidth={["70%", "100%", "50%"]}
                />
               
            </View>
        );
    }

    handleRefresh = () => {

        this.setState({
            paymentcarddetails: [],
            customerpaymentaccountdetails: [],
            empty: false,
            loading: false,
            refreshing: true,
        }, () => {
            this.fetchData();
        });
        
    }

    renderFooter = () => {
        return (
        <View
            style={{
                paddingVertical: 50,
                borderTopWidth: 0,
                borderColor: "#CED0CE"
            }}
        >
        </View>
        );
    };

    renderEmptyView() {
        return (
          <Touchable 
            style={{ margin: 15, borderWidth: 1, borderColor: '#ECECEC', padding:25, elevation:1, borderRadius: 10, backgroundColor: 'white'  }}
            delayPressIn = {5000}
            background={Touchable.Ripple(colors.ripplegray)}>
    
              <View style={{ flexDirection: 'column'}}>
    
                  <Image
                    style={{ width: 50, height: 50, alignSelf: 'center', opacity: 0.3 }}
                    source={{uri: "https://icons-for-free.com/iconfiles/png/512/linecon+more+plus+round+icon-1320165922585878770.png"}} />
    
                  <Text style={{ color: 'black', paddingTop: 15, fontSize: 15, textAlign: 'center' }}>
                  Add Payment Card</Text>
          
              </View>
    
    
          </Touchable>
        );
    }


    renderFlatListView() {
        return (
            <List  containerStyle={{ backgroundColor: 'transparent', marginTop:0, paddingTop:0, paddingHorizontal: 5, borderBottomWidth: 0, borderTopWidth: 0, }}>
            <FlatList
                data={this.state.paymentcarddetails}
                keyExtractor={(item) => item._id}
                renderItem={this._renderItem}
                ListFooterComponent={this.renderFooter} 
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                showsVerticalScrollIndicator={false}
                />
            </List>
        );
    }

    render() {
        return (
        <View style={{ flex: 1, paddingTop: 20, }}>
            {this.state.loading ? this.renderLoadingView() : this.state.empty ? this.renderEmptyView() : this.renderFlatListView()}
        </View>
        )
    }
}

const mapStateToProps = state => ({
    getJWTToken: state.getJWTToken,
    getRefreshToken: state.getRefreshToken,
    getUserid: state.getUserid,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

PaymentMethod.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethod);

