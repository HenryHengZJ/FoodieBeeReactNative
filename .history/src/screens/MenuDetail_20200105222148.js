
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
import img from '../img/s3'

import * as Animatable from 'react-native-animatable';
import Touchable from 'react-native-platform-touchable';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import Moment from 'moment';

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

export default class MenuDetail extends Component {

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
        };

        this.timeranges = ['11:30 AM','11:45 AM','12:00 PM','12:15 PM','12:30 PM','12:45 PM','13:00 PM','13:15 PM','13:30 PM','13:45 PM', '14:00 PM', '14:15 PM', '14:30 PM', '14:45 PM', '15:00 PM', '15:15 PM', '15:30 PM']
    }

    componentDidMount() {
        const { navigation } = this.props;
        const selectedLunchMenu = JSON.parse(navigation.getParam('selectedLunchMenu'));
        const customerIsPrime = navigation.getParam('customerIsPrime');
        
        this.setState({
            selectedLunchMenu,
            customerIsPrime,
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
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = 'Custom Label';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        Linking.openURL(url); 
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
                            onPress={() => console.log("ss")}
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
                            onPress={() => console.log("message pressed")}
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
                        >
                            <Text style={{ alignSelf: 'center', color: 'white', fontWeight: '500', fontSize: 17}}>
                                PRE-ORDER
                            </Text>

                    </TouchableOpacity>

                    <Text style={{ textDecorationLine: !this.state.customerIsPrime ? 'line-through' : null, alignSelf: 'center', marginLeft: 20, marginRight: 10, color: 'black', fontWeight: '500', fontSize: !this.state.customerIsPrime ? 17:23, opacity: !this.state.customerIsPrime ? 0.5:1}}>
                        €{Number(selectedLunchMenu.priceperunit).toFixed(2)}
                    </Text>

                    {!this.state.customerIsPrime ? 

                    <Text style={{ alignSelf: 'center', marginLeft: 10, marginRight: 20, color: 'black', fontWeight: '500', fontSize: 23}}>
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


MenuDetail.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};
