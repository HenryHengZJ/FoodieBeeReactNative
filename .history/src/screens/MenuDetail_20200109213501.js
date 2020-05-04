
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
  Animated,
  Easing,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Modal,
  Alert,
  TextInput,
  Picker,
  NetInfo,
  Linking,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import colors from '../styles/colors';
import apis from '../apis';
import img from '../img/s3';
import deviceStorage from '../helpers/deviceStorage';
import OrderModal from '../components/OrderModal';
import ActionCreators from '../redux/actions';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Animatable from 'react-native-animatable';
import Touchable from 'react-native-platform-touchable';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import moment from 'moment';

const androidblackBackIcon = require('../img/android_back_black.png');
const androidwhiteBackIcon = require('../img/android_back_white.png');
const iosblackBackIcon = require('../img/ios_back_black.png');
const ioswhiteBackIcon = require('../img/ios_back_white.png');
const internetIcon = require('../img/wifi.png');

const SLIDE_IN_DOWN_KEYFRAMES = {
  from: { translateY: -50 },
  to: { translateY: 0 },
};

const SLIDE_IN_UP_KEYFRAMES = {
  from: { translateY: 0 },
  to: { translateY: -80 },
};

const GOOGLE_API_KEY= "AIzaSyCFHrZBb72wmg5LTiMjUgI_CLhsoMLmlBk"

class MenuDetail extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Menu Details",
        headerTitleStyle: {
        fontWeight: '500',
        fontSize: 17,
        color: colors.greyBlack,
        }
    });

    constructor(props) {
        super(props);
        this.onNewCardAdded = this.onNewCardAdded.bind(this);
        this.state = {
            measures: 0,
            header: false,
            animation: '',
            firstopen: true,
            customerIsPrime: null,
            selectedPickUpTime: "",
            selectedLunchMenu: null,
            internetStatus: true,
            error: false,
            progress: new Animated.Value(0),
            timeranges: [],
            customerEmail: "",
            customerPaymentAccountID: "",
            subscriptionID: "",
            orderModal: false,
            orderStatus: "",
            customerHasOrderedToday: null,
        };

        this.timeranges = ['11:30 AM','11:45 AM','12:00 PM','12:15 PM','12:30 PM','12:45 PM','13:00 PM','13:15 PM','13:30 PM','13:45 PM', '14:00 PM', '14:15 PM', '14:30 PM', '14:45 PM', '15:00 PM', '15:15 PM', '15:30 PM']
    }

    componentDidMount() {
        const { navigation, getCustomerHasOrderedToday } = this.props;

        const selectedLunchMenu = JSON.parse(navigation.getParam('selectedLunchMenu'));
        const customerIsPrime = navigation.getParam('customerIsPrime');
        const customerEmail = navigation.getParam('customerEmail');
        const customerPaymentAccountID = navigation.getParam('customerPaymentAccountID');
        const subscriptionID = navigation.getParam('subscriptionID');

        var customerHasOrderedToday;
        if (getCustomerHasOrderedToday.customerHasOrderedToday) {
            customerHasOrderedToday = true;
        }
        else {
            customerHasOrderedToday = navigation.getParam('customerHasOrderedToday');
        }

        this.setState({
            selectedLunchMenu,
            customerIsPrime,
            customerHasOrderedToday,
            customerEmail,
            customerPaymentAccountID,
            subscriptionID,
        });

        this.startAnimation();
        this.formatTimeRanges();

        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    
        NetInfo.isConnected.fetch().done(
          (isConnected) => { this.setState({ internetStatus: isConnected }); }
        );
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
        navigator.geolocation.clearWatch(this.watchID);

    }

    formatTimeRanges = () => {
        var newtimeranges = []
        for (var i = 0; i < this.timeranges.length; i ++) {
          const updateval = {
            label: this.timeranges[i],
            value: this.timeranges[i]
          }
          newtimeranges.push(updateval)
        }
        this.setState({
          timeranges: newtimeranges
        })
    }

    startAnimation() {
        Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
        }).start(() => {
            this.setState({
                progress: new Animated.Value(0),
            })    
            this.startAnimation();
        });
    }

    handleScroll(event){
        if (event.nativeEvent.contentOffset.y > this.state.measures) {
        this.setState({
            header: true,
            animation: 'slideInDown',
            firstopen: false
        })
        }
        else {
        this.setState({
            header: false,
            animation: 'slideInUp',
        })
        }
    }

    getSaveAmount = (priceperunit, discountedprice) => {
        var savedamount = parseFloat(priceperunit) - parseFloat(discountedprice)
        return Number(savedamount).toFixed(2)
    }

    openMaps = (lat, lng) => {

        this.watchID = navigator.geolocation.getCurrentPosition((position) => {
            const user_lat = position.coords.latitude;
            const user_lng = position.coords.longitude;
            const url = `https://www.google.com/maps/dir/?api=1&origin=${user_lat},${user_lng}&destination=${lat},${lng}`
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => console.error('An error occurred', err)); 
          },
          (err) => {
            const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
            const latLng = `${lat},${lng}`;
            const label = 'Custom Label';
            const url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`
            });
    
            Linking.openURL(url); 
          }
        );
    }

   /* openMaps = (lat, lng) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = 'Custom Label';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        Linking.openURL(url); 
    }*/

    gotoPrime = (navigation) => {
        navigation.navigate('Prime', { 
            customerIsPrime: this.state.customerIsPrime,
        });
    }

    goToMyOrders = (navigation) => {
        this.setState({
            orderModal: false
        }, () => {
            navigation.navigate('MyOrders');
        })
    }

    dismissOrderModal = () => {
        this.setState({
            orderModal: false
        })
    }

    showAlert = (title, descrip) => {
        Alert.alert(
            title,
            descrip,
            [
                {text: 'OK',
                    onPress: () => {null},
                    style: 'cancel'
                },
            ],
            { cancelable: true },
            { onDismiss: () => {} }
          )
    }

    goToLogin = (navigation) => {
        navigation.navigate('LogIn');
    }

    addNewCard = () => {
        this.props.navigation.navigate('AddNewCard', { 
            customerEmail: this.state.customerEmail,
            customerPaymentAccountID: this.state.customerPaymentAccountID,
            onNewCardAdded: this.onNewCardAdded 
        });
    }

    onNewCardAdded(cardAdded, customerPaymentAccountID) {
        if (cardAdded) {
            this.setState({
                customerPaymentAccountID,
            }, () => {
                this.getCustomerCard();
            });  
        } 
    }

    checkIfUserHasOrderedToday = () => {
        var returnval = false;
        if (this.props.getCustomerHasOrderedToday.customerHasOrderedToday) {
            returnval = true
        }
        return returnval
    }

    getCustomerCard = () => {

        if (this.checkIfUserHasOrderedToday()) {
            this.showAlert("Quota Used", "You have reached quota of 1 order per day.")
            return
        }

        this.setState({
            orderModal: true,
            orderStatus: 'Loading'
        })
    
        var headers = {
          'Content-Type': 'application/json',
        }
    
        var url = apis.GETcustomer_card+ "?customerPaymentAccountID=" + this.state.customerPaymentAccountID;
    
        axios({method: 'get', url: url, headers: headers})
        .then((response) => {
            if (response.status === 200) {
                const customerPaymentCardID = response.data.data[0].id
                const customerPaymentCardBrand = response.data.data[0].card.brand
                this.payByDefaultCard(customerPaymentCardID, customerPaymentCardBrand)
            } 
        })
        .catch(err => {
            this.setState({
                orderStatus: 'Failed'
            })
        });
    }
    
    payByDefaultCard = (customerPaymentCardID, customerPaymentCardBrand) => {

        const {customerEmail, customerPaymentAccountID} = this.state
    
        var makepaymentdetails = {}
        makepaymentdetails.customerEmail = customerEmail
        makepaymentdetails.customerPaymentAccountID = customerPaymentAccountID
        makepaymentdetails.paymentMethodID = customerPaymentCardID
        makepaymentdetails.paymentType = customerPaymentCardBrand
        makepaymentdetails.totalOrderPrice = this.state.customerIsPrime ? this.state.selectedLunchMenu.discountedprice : this.state.selectedLunchMenu.priceperunit
        makepaymentdetails.catererPaymentAccountID = this.state.selectedLunchMenu.catererDetails[0].catererPaymentAccountID
        makepaymentdetails.commission = this.state.customerIsPrime ? 0.05 : 0.1
    
        var headers = {
          'Content-Type': 'application/json',
        }
    
        var url = apis.POSTcustomer_makepayment;

        axios({method: 'post', data: makepaymentdetails, url: url, headers: headers})
        .then((response) => {
            if (response.status === 200) {
                this.addLunchOrder(response.data.id, customerPaymentCardBrand);
            } 
        })
        .catch(err => {
            this.setState({
                orderStatus: 'Failed'
            })
        });
    }
    
    addLunchOrder = (paymentIntentID, paymentType) => {
    
        var pickupTime = null
        var createdAt = null
    
        var timenow = parseInt(moment(new Date()).format("HHmm"));
        if (timenow > 1700) {
          //Add 1 day
          pickupTime = moment(this.state.selectedPickUpTime, 'hh:mm A').add(1, 'days').toISOString();
          createdAt = moment().add(1, 'days').toISOString();
        }
        else {
          pickupTime = moment(this.state.selectedPickUpTime, 'hh:mm A').toISOString();
          createdAt = moment().toISOString();
        }
        
        const {selectedLunchMenu} = this.state
    
        var dataToUpdate = {
          orderItemID: selectedLunchMenu._id,
          orderItem:[
            {
              title: selectedLunchMenu.title,
              descrip: selectedLunchMenu.descrip,
              priceperunit: selectedLunchMenu.priceperunit,
              src: selectedLunchMenu.src,
            }
          ],
          catererID: selectedLunchMenu.catererID,
          totalOrderPrice: this.state.customerIsPrime ? selectedLunchMenu.discountedprice : selectedLunchMenu.priceperunit,
          commission: this.state.customerIsPrime ? 5 : 10,
          netOrderPrice: this.calculateNetOrderPrice(),
          orderStatus: 'pending',
          paymentIntentID: paymentIntentID,
          paymentType: paymentType,
          paymentStatus: 'incomplete',
          pickupTime: pickupTime,
          createdAt: createdAt,  
          updatedAt: createdAt, 
        }

        var headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.props.getJWTToken.jwttoken + " Refresh " + this.props.getRefreshToken.refreshtoken,
        }
    
        var url = apis.POSTlunchaddorder;

        axios({method: 'post', data: dataToUpdate, url: url, headers: headers})
        .then((response) => {
            if (response.headers['x-auth'] !== 'undefined') {
                deviceStorage.saveItem("jwttoken", response.headers['x-auth']);
                this.props.setJWT(response.headers['x-auth'])
            }
            if (response.status === 200) {
                this.props.setcustomerHasOrderedToday(true)
                this.setState({
                    orderStatus: 'Success'
                })
            } 
        })
        .catch((error) => {
            this.setState({
                orderStatus: 'Failed'
            })
        });
      
    }

    calculateNetOrderPrice = () => {
        var netOrderPrice = 0
        if (this.state.customerIsPrime) {
          netOrderPrice = parseFloat(this.state.selectedLunchMenu.discountedprice) * 0.95
        }
        else {
          netOrderPrice = parseFloat(this.state.selectedLunchMenu.priceperunit) * 0.90
        }
        return netOrderPrice.toFixed(2);
    }

    renderBackButton(btncolor) {
        return (
        <TouchableOpacity
            style={{ 
                position:'absolute', 
                left:10, 
                top:20, 
                zIndex:10,
                padding:10, 
                height: 50,
                width: 50,
                alignItems:'center',
                justifyContent:'center',
                backgroundColor: 'transparent'}}
                onPress={() => this.props.navigation.goBack()}
            >

            {btncolor === "white" ? 
            <Image
                style={{ 
                height: 30,
                width: 30,
                }}
                source={Platform.OS == 'android' ? androidwhiteBackIcon : ioswhiteBackIcon }
            />
            :
            <Image
                style={{ 
                height: 30,
                width: 30,
                }}
                source={Platform.OS == 'android' ? androidblackBackIcon : iosblackBackIcon}
            />
            }
            </TouchableOpacity>
        )
    }

    renderNoInternetView() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 20, paddingBottom: 10 }}>
                
                <View style={{flex: 1 , alignSelf:'center', alignItems:'center', justifyContent:'center',backgroundColor: 'white'}}>
                    <Image 
                        style={{ alignSelf:'center', alignItems:'center', justifyContent:'center', marginRight: 10,  height: 100, width: 100 }}
                        source={internetIcon} />
                    <Text
                        style={{ fontSize: 17, marginTop: 20, alignSelf:'center', alignItems:'center', justifyContent:'center', fontWeight: '400', color: colors.greyBlack  }}
                    >No Internet Connection</Text>
                    <TouchableOpacity
                        style={{ 
                        borderLeftWidth: 0.5, 
                        borderRightWidth: 0.5, 
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
                        marginTop:20,
                        alignSelf: 'center',
                        paddingTop:10,
                        paddingBottom:10,
                        paddingLeft:20,
                        paddingRight:20,
                        justifyContent:'center',
                        elevation:3,
                        backgroundColor: '#67B8ED'}}
                        onPress={() => NetInfo.isConnected.fetch().done( (isConnected) => { this.setState({ internetStatus: isConnected }) })}
                    >

                    <View style={{flexDirection: 'row'}}>

                        <Text style={{ color: 'white', alignItems:'center',alignSelf:'center', justifyContent:'center', fontWeight: '500', fontSize: 15}}>
                            RETRY
                        </Text>

                    </View>

                    </TouchableOpacity>

                </View>

            </View>
        );
    }

    renderErrorView() {
        return (
        
            <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 20, paddingBottom: 10 }}>
            
                <View style={{flex: 1 , alignSelf:'center', alignItems:'center', justifyContent:'center',backgroundColor: 'white'}}>
                    <LottieView 
                        loop={true}
                        style={{ alignSelf:'center', alignItems:'center', justifyContent:'center', marginRight: 10,  height: 100, width: 100 }}
                        source={Platform.OS == 'android' ? "empty_box.json" : require('../animation/empty_box.json')} progress={this.state.progress} />
                    <Text
                        style={{ fontSize: 17, marginTop: 20, alignSelf:'center', alignItems:'center', justifyContent:'center', fontWeight: '400', color: colors.greyBlack  }}
                    >Oops, item not found</Text>

                </View>

            </View>
        );
    }


    renderMenuDetailView() {

        const {selectedLunchMenu} = this.state

        var latitude = selectedLunchMenu.catererDetails[0].location.coordinates[0]

        var longitude = selectedLunchMenu.catererDetails[0].location.coordinates[1]

        return (
            <View style={{backgroundColor:'transparent', flex:1}}>
            <ScrollView         
                keyboardShouldPersistTaps='handled'
                scrollEventThrottle={16}
                onScroll={this.handleScroll.bind(this)}
                style={{backgroundColor:'transparent', flex:1}}>


                <Image
                    style={{ height: 200, width: '100%'}}
                    source={{uri: selectedLunchMenu.src}} />

                <View style={{marginBottom: 150}}>

                    <View 
                    style={{ marginTop:20, marginLeft:20, marginRight:20, flexDirection: 'column'}}
                    >

                    <Text style={{ flex: 1, color: colors.greyBlack, fontWeight: '700', marginTop:10, fontSize: 24, opacity: 0.9}}>
                        {selectedLunchMenu.title}
                    </Text>

                    </View>


                    <View 
                    style={{ marginHorizontal: 20, marginTop:20, flexDirection: 'row'}}
                    onLayout={({nativeEvent}) => {
                        this.setState({
                        measures: nativeEvent.layout.y
                        })
                    }}>

                    <TouchableOpacity
                        style={{ 
                            height: 50, 
                            width: 50,
                            borderRadius: 25, 
                        }}
                        disabled
                    >
                        <Image
                        style={{ height: 50, width: 50, borderRadius: 25}}
                        source={{uri: selectedLunchMenu.catererDetails[0].profilesrc} }
                        />

                    </TouchableOpacity>

                
                    <View 
                        style={{marginLeft: 20, marginRight: 20, flexDirection: 'column'}}>

                        <Text style={{ color: colors.greyBlack, fontWeight: '500', marginRight: 150, marginTop:10, fontSize: 17}}>
                            {selectedLunchMenu.catererDetails[0].catererName} 
                        </Text>

                    </View>

                    </View>

                    <View 
                    style={{marginLeft: 20, marginRight: 20, marginTop:20, flexDirection: 'column'}}>

                    <Text style={{ color: colors.greyBlack, lineHeight: 30, fontSize: 15}}>
                        {selectedLunchMenu.descrip}
                    </Text>

                    </View>

                    {this.state.customerIsPrime ?

                    <View 
                    style={{marginLeft: 20, marginRight: 20, marginTop:20, flexDirection: 'row'}}>

                    <Text style={{ marginTop: 5, alignSelf: 'flex-start', color: '#FF5722', fontWeight: '500', fontSize: 16}}>
                        You saved €{this.getSaveAmount(selectedLunchMenu.priceperunit, selectedLunchMenu.discountedprice)} with  
                    </Text>

                    <View 
                        style={{
                        padding: 7,
                        backgroundColor: '#FF5722',
                        borderRadius: 5,
                        marginLeft: 10,
                        }}>
                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 14 }}>PRIME</Text>
                        </View>

                    </View>

                    : null }

                    {!this.state.customerIsPrime ?

                    <View style={{ marginTop: 20, backgroundColor: '#eeeeee', height:1, alignSelf: 'center', justifyContent: 'center',  width: '90%'}}/> : null }
                        
                    {!this.state.customerIsPrime ?

                    <View 
                    style={{ marginLeft: 20, marginRight: 20, marginTop:20, flexDirection: 'row',}} >

                        <View 
                        style={{ flexDirection: 'column'}} >

                        <Text style={{ alignSelf: 'flex-start', color: '#FF5722', fontWeight: '500', fontSize: 17}}>
                            Get it for €{selectedLunchMenu.discountedprice} with  
                        </Text>
                        <Text style={{ marginTop: 5, alignSelf: 'flex-start', color: '#FF5722', fontWeight: '400', fontSize: 16}}>
                            You saved €{this.getSaveAmount(selectedLunchMenu.priceperunit, selectedLunchMenu.discountedprice)} with  
                        </Text>

                        </View>

                        <TouchableOpacity
                            style={{ 
                            borderRadius:5, 
                            paddingTop:10,
                            paddingBottom:10,
                            paddingLeft:15,
                            paddingRight:15,
                            marginLeft: 20,
                            justifyContent:'center',
                            elevation:2,
                            backgroundColor: '#FF5722'}}
                            onPress={this.gotoPrime.bind(this, this.props.navigation)} 
                        >

                        <View>

                            <Text style={{ color: 'white', alignItems:'center',alignSelf:'center', justifyContent:'center', fontWeight: '500', fontSize: 15}}>
                                PRIME
                            </Text>

                        </View>

                        </TouchableOpacity>

                    </View> : null }
        
                    {!this.state.customerIsPrime ?

                    <View style={{ marginTop: 20, backgroundColor: '#eeeeee', height:1, alignSelf: 'center', justifyContent: 'center',  width: '90%'}}/> : null }

                    <View 
                    style={{marginLeft: 20, marginRight: 20, marginTop:20, flexDirection: 'row'}}>

                    <Image
                        style={{ marginTop:10, height: 25, width: 25}}
                        source={{uri: img.mapmarker}}
                    />

                    <Text style={{ color: colors.priceblue, fontWeight: '500', lineHeight: 30,  marginTop:7, marginLeft: 20, marginRight:20,fontSize: 15}}>
                        {selectedLunchMenu.catererDetails[0].catererFullAddress}
                    </Text>

                    </View>

                    <Touchable 
                        background={Touchable.Ripple(colors.ripplegray)}   
                        style={{marginTop:20, height: 150, width: '100%'}}
                        onPress={this.openMaps.bind(this, latitude, longitude)}
                    >

                    <Image
                        style={{ height: 150, width: '100%'}}
                        source={
                        {uri:'http://maps.google.com/maps/api/staticmap?center='+ latitude +','+ longitude +'&markers=color:0xff0000%7Clabel:%7C'+ latitude +','+ longitude +'&zoom=14&size=400x200&key=' + GOOGLE_API_KEY}}
                    />

                    </Touchable>

                </View>

                </ScrollView>

                <View 
                style={{ 
                    position: 'absolute',
                    bottom: 0,
                    right: 0, 
                    left: 0, 
                    backgroundColor:'white', 
                    height: 130, 
                    width: '100%', 
                    flex:1, 
                    flexDirection: 'column'}}>

                <View 
                    style={{ backgroundColor: '#eeeeee', height:1, width: '100%'}}/>

                <View style={{ padding:15 }}>
                    <RNPickerSelect
                        onValueChange={value => {
                            this.setState({
                                selectedPickUpTime: value,
                            });
                        }}
                        placeholder={{}}
                        InputAccessoryView={() => null}
                        useNativeAndroidPickerStyle
                        items={this.state.timeranges}
                    >

                        <View
                            style={{ 
                                borderRadius:5, 
                                borderColor: 'gray',
                                borderWidth: 1,
                                marginLeft: 20, 
                                marginRight: 20,
                                flex:1,
                                paddingTop:20,
                                paddingBottom:20,
                                paddingLeft:15,
                                paddingRight:15,
                                justifyContent:'center',
                                backgroundColor: 'white'}}
                            >
                            <Text style={{ alignSelf: 'center', fontWeight: '500', color: this.state.selectedPickUpTime === "" ? 'gray' : 'black', fontSize: 17, }}>
                                {this.state.selectedPickUpTime === "" ? "Select Pickup Time" : this.state.selectedPickUpTime} 
                            </Text>

                        </View>

                    </RNPickerSelect>
                
                </View>

                <View 
                    style={{ paddingLeft:15 , paddingRight:15 , flexDirection: 'row' }}>

                    <TouchableOpacity
                        style={{ 
                            borderRadius:5, 
                            marginLeft: 20, 
                            flex:1,
                            paddingTop:10,
                            paddingBottom:10,
                            paddingLeft:15,
                            paddingRight:15,
                            justifyContent:'center',
                            elevation:3,
                            backgroundColor: '#20a8d8'}}
                            onPress={this.state.customerEmail === "" ? this.goToLogin.bind(this, this.props.navigation) : this.state.customerHasOrderedToday ? this.showAlert.bind(this, "Quota Used", "You have reached quota of 1 order per day.") : this.state.selectedPickUpTime === "" ? this.showAlert.bind(this, "Select Pickup Time", "Please select a pickup time before ordering.") : this.state.customerPaymentAccountID === "" ? this.addNewCard.bind(this) : this.getCustomerCard.bind(this)}
                        >
                            <Text style={{ alignSelf: 'center', color: 'white', fontWeight: '500', fontSize: 17}}>
                                PRE-ORDER
                            </Text>

                    </TouchableOpacity>

                    <Text style={{ textDecorationLine: this.state.customerIsPrime ? 'line-through' : null, alignSelf: 'center', marginLeft: 20, marginRight: 10, color: 'black', fontWeight: '500', fontSize: this.state.customerIsPrime ? 20:23, opacity: this.state.customerIsPrime ? 0.5:1}}>
                        €{Number(selectedLunchMenu.priceperunit).toFixed(2)}
                    </Text>

                    {this.state.customerIsPrime ? 

                    <Text style={{ alignSelf: 'center', marginLeft: 10, marginRight: 20, color: '#FF5722', fontWeight: '500', fontSize: 23}}>
                        €{Number(selectedLunchMenu.discountedprice).toFixed(2)}
                    </Text> 

                    : null }
                
                </View>

                </View>

            </View>
        );
    }

    render() {

        const { error, internetStatus, selectedLunchMenu} = this.state

            return (

                <View style={{backgroundColor:'white', flex:1}}>

                { !internetStatus ? this.renderNoInternetView() : error ? this.renderErrorView() : selectedLunchMenu ? this.renderMenuDetailView() : null }

                <OrderModal  
                    animationType = "slide"
                    modalVisible = {this.state.orderModal}
                    handleOnPress = {this.state.orderStatus === "Success" ? this.goToMyOrders.bind(this, this.props.navigation) : this.dismissOrderModal.bind(this)}
                    orderStatus = {this.state.orderStatus}
                >
                </OrderModal>
                
                {this.state.firstopen ? 
                    <View style={styles.headerOrginal}>
                        {this.renderBackButton("white")}
                    </View> 
                    :  
                    <View style={styles.header1}>
                    {this.state.header ? 
                        <Animatable.View duration={500} useNativeDriver={true} animation={SLIDE_IN_DOWN_KEYFRAMES} onAnimationEnd={() => this.setState({firstopen: false})} style={styles.header}>
                            {this.renderBackButton("black")}
                        </Animatable.View> 
                        :  
                        <Animatable.View duration={500} useNativeDriver={true} animation={SLIDE_IN_UP_KEYFRAMES} 
                        onAnimationEnd={() => this.setState({firstopen: true})} style={styles.header}>
                            {this.renderBackButton("black")}
                        </Animatable.View>
                    }
                    </View>
                }

            </View>
        );
    }
}

const mapStateToProps = state => ({
    getJWTToken: state.getJWTToken,
    getRefreshToken: state.getRefreshToken,
    getCustomerHasOrderedToday: state.getCustomerHasOrderedToday,
    getUserid: state.getUserid,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

MenuDetail.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  setcustomerHasOrderedToday: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuDetail);

const styles = StyleSheet.create({
  header: {
    paddingTop: 35,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: colors.white,
    position: 'absolute',
    top: 0,
    left:0,
    right:0,
    zIndex:1,
    height:70,
    borderBottomWidth: 1,
    borderColor: "#CED0CE",
  },
  header1: {
    paddingTop: 35,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left:0,
    right:0,
    zIndex:1,
    height:70,
  },
  headerOrginal: {
    paddingTop: 35,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left:0,
    right:0,
    zIndex:1,
    height:70,
    borderColor: "#CED0CE",
  },
  onePicker: {
    width: 200,
    height: 44,
    backgroundColor: '#FFF0E0',
    borderColor: 'black',
    borderWidth: 1,
  },
  onePickerItem: {
    height: 44,
    color: 'red'
  },
});
