
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  BackHandler,
  Animated,
  Platform,
  StatusBar,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  TextInput, 
  Alert,
  AlertIOS,
  Keyboard,
  NativeModules,
  NetInfo,
  AsyncStorage,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../redux/actions';
import Notification from '../components/Notification';
import NavBarButton from '../components/buttons/NavBarButton'
import Loader from '../components/Loader';
import colors from '../styles/colors';
import apis from '../apis';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';

const counties = [
    "Dublin",
    "Cork",
    "Limerick",      
    "Galway",
    "Waterford",
    "Antrim",
    "Armagh",
    "Carlow",
    "Cavan",
    "Clare",
    "Cork",
    "Donegal",
    "Down",
    "Fermanagh",
    "Kerry",
    "Kildare",
    "Kilkenny",
    "Laois",
    "Leitrim",
    "Londonderry",
    "Longford",
    "Louth",
    "Mayo",
    "Meath",
    "Monaghan",
    "Offaly",
    "Roscommon",
    "Sligo",
    "Tipperary",
    "Tyrone",
    "Westmeath",
    "Wexford",
    "Wicklow",
]


const internetIcon = require('../img/wifi.png');

class MyDetails extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerRight: <NavBarButton 
            handleButtonPress={() => 
                this.updateUserProfile()
            } 
            location="right" color={colors.priceblue} text="SAVE" />,
        headerLeft: <NavBarButton 
            handleButtonPress={() => this.handleGoBack(navigation)} 
            location="left"
            icon={Platform.OS === 'ios' ? <Icon name="angle-left" color={colors.black} size={30} /> : <MaterialIcon name="arrow-back" color={colors.black} size={24} />} />,
    });

    constructor(props) {
        super(props);
        this.state = {
            showNotification: false,
            firsterrorline: "",
            seconderrorline: "",
            loadingVisible: true,
            saveloadingVisible: false,
            countiesList: [],
            userid: null,
            error: null,
            customerFirstName: null,
            customerLastName: null,
            customerPhoneNumber: null,
            customerCity: null,
            customerCounty: null,
            customerEmail: null,
            internetStatus: false,
        };

        this.handleCloseNotification = this.handleCloseNotification.bind(this);
    
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

        NetInfo.isConnected.fetch().done((isConnected) => { 
            this.setState({ 
                internetStatus: isConnected 
            }, () => {
                if (isConnected) {
                    this.fetchUserData()
                }
            })
        });

        this.formatCounties()
    }

    handleConnectionChange = (isConnected) => {
        this.setState({ internetStatus: isConnected });
        console.log(`is connected: ${this.state.internetStatus}`);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleGoBack = (navigation) => {
        Alert.alert(
            'Unsaved changes',
            'You have unsaved changes to your details. Do you want to discard the changes?',
            [
                {text: 'CANCEL',
                    onPress: () => {null},
                    style: 'cancel'
                },
                {text: 'DISCARD', 
                    onPress: () => 
                    {
                      navigation.goBack()
                    }
                },
            ],
            { cancelable: true },
            { onDismiss: () => {} }
        )
    }

    formatCounties = () => {
        var newcounties = []
        for (var i = 0; i < counties.length; i ++) {
        const updateval = {
            label: counties[i],
            value: counties[i]
        }
        newcounties.push(updateval)
        }
        this.setState({
            countiesList: newcounties
        })
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

    
    validateEmail (email) {
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(String(email).toLowerCase());
    }

    validatePhoneNumber (phone) {
        var returnval;
        if (phone.length === 10) {
          returnval = true
        }
        else {
          returnval = false
        }
        return returnval
    }

    updateUserProfile = () => {

        this.setState({saveloadingVisible : true});

        const { 
            customerFirstName,
            customerLastName,
            customerPhoneNumber,
            customerCity,
            customerCounty,
            customerEmail,
        } = this.state;

        if (customerFirstName === "") {
            this.setState({
                firsterrorline: "First name must be filled"
            });
        } else if (customerLastName === "") {
            this.setState({
                firsterrorline: "Last name must be filled"
            });
        } else if ((customerEmail === "") || !this.validateEmail(customerEmail) ) {
            this.setState({
                firsterrorline: "Email must be filled correctly"
            });
        } else if ((customerPhoneNumber === "") || !this.validatePhoneNumber(customerPhoneNumber)) {
            this.setState({
                firsterrorline: "Phone number must be entered correctly."
            });
        } else {

            var body = {
                customerFirstName: customerFirstName,
                customerLastName: customerLastName,
                customerEmail: customerEmail,
                customerPhoneNumber: customerPhoneNumber,
                customerCountry: "Ireland",
                customerCountryCode: "+353"
            }

            if (customerCounty !== "") {
                body.customerCounty = customerCounty
            }
        
            if (customerCity !== "") {
                body.customerCity = customerCity
            }

            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getJWTToken.jwttoken + " Refresh " + this.props.getRefreshToken.refreshtoken,
            }

            var url = apis.UPDATEcustomerprofile;

            axios.put(url, body, {withCredentials: true}, {headers: headers})
            .then((response) => {
                if (response.headers['x-auth'] !== 'undefined') {
                    deviceStorage.saveItem("jwttoken", response.headers['x-auth']);
                    this.props.setJWT(response.headers['x-auth'])
                }
                if (response.status === 201) {
                    this.setState({ showNotification: false, saveloadingVisible: false})
                } 
            })
            .catch((error) => {
                this.setState({ saveloadingVisible: false, showNotification: true });
            }); 
        }
    }


    handleCloseNotification() {
        this.setState({ showNotification: false });
    }

    renderFirstName(firstname) {
        return (
        <View style={{ marginVertical:20 ,marginHorizontal: 25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
        
            <TextInput 
                lineHeight= {30}
                underlineColorAndroid='rgba(0,0,0,0)' 
                multiline={true} 
                placeholder="Your first name"
                placeholderTextColor="grey"
                onChangeText={(value) => this.setState({customerFirstName: value})}
                value={firstname}
                style={{ padding: 0, color: colors.greyBlack,   marginHorizontal: 10, fontSize: 15}}>
            </TextInput>

        </View>
        )
    }

    renderLastName(lastname) {
        return (
        <View style={{ marginVertical:20 ,marginHorizontal: 25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
        
            <TextInput 
                lineHeight= {30}
                underlineColorAndroid='rgba(0,0,0,0)' 
                multiline={true} 
                placeholder="Your last name"
                placeholderTextColor="grey"
                onChangeText={(value) => this.setState({customerLastName: value})}
                value={lastname}
                style={{ padding: 0, color: colors.greyBlack,   marginHorizontal: 10, fontSize: 15}}>
            </TextInput>

        </View>
        )
    }

    renderPhoneNumber(phonenumber) {
        return (
        <View style={{  marginVertical:20 ,marginHorizontal: 25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
        
            <TextInput 
                underlineColorAndroid='rgba(0,0,0,0)' 
                placeholder="Enter your phone number here"
                placeholderTextColor="grey"
                keyboardType='phone-pad'
                onChangeText={(value) => this.setState({customerPhoneNumber: value})}
                value={phonenumber}
                style={{ padding: 0, color: colors.greyBlack,  marginHorizontal: 10, fontSize: 15}}>
            </TextInput>

        </View>
        )
    }
    
    renderEmail(email) {
        return (
        <View style={{  marginVertical:20 ,marginHorizontal: 25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
        
            <TextInput 
                underlineColorAndroid='rgba(0,0,0,0)' 
                placeholder="Enter your work email here"
                placeholderTextColor="grey"
                keyboardType="email-address"
                onChangeText={(value) => this.setState({customerEmail: value})}
                value={email}
                style={{ padding: 0, color: colors.greyBlack,  marginHorizontal: 10, fontSize: 15}}>
            </TextInput>

        </View>
        )
    }
    
    renderCounty(county) {
        return (
        <TouchableOpacity style={{  marginVertical:20 ,marginHorizontal: 25,}}>
            
            <RNPickerSelect
                onValueChange={value => {
                    this.setState({
                        customerCounty: value,
                    });
                }}
                placeholder={{}}
                InputAccessoryView={() => null}
                items={this.state.countiesList}
            >

                <View style={{ flex:1, borderWidth: 1, padding:10, borderRadius: 5, borderColor: '#d6d7da', flexDirection: 'row'}}>
                    <Text style={{ flex:1, lineHeight: 30,  color: 'grey', marginHorizontal: 10, fontSize: 15}}>
                        {county === "" ? "Select County" : county} 
                    </Text>
                </View>

            </RNPickerSelect>
        </TouchableOpacity>
        )
    }

    renderHomeAddress(address) {
        return (
        <View style={{ marginVertical:20 ,marginHorizontal: 25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
        
            <TextInput 
                lineHeight= {30}
                underlineColorAndroid='rgba(0,0,0,0)' 
                multiline={true} 
                placeholder="Your home address"
                placeholderTextColor="grey"
                onChangeText={(value) => this.setState({customerCity: value})}
                value={address}
                style={{ padding: 0, color: colors.greyBlack,   marginHorizontal: 10, fontSize: 15}}>
            </TextInput>

        </View>
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
                    borderColor: '#ddd', 
                    borderRadius:25,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 1,
                        height: 3,
                    },
                    shadowRadius: 25,
                    shadowOpacity: 0.8,
                    marginTop:20,
                    alignSelf: 'center',
                    paddingTop:10,
                    paddingBottom:10,
                    paddingLeft:20,
                    paddingRight:20,
                    justifyContent:'center',
                    elevation:3,
                    backgroundColor: '#67B8ED'}}
                    onPress={() => 
                        NetInfo.isConnected.fetch().done(
                        (isConnected) => { this.setState({ internetStatus: isConnected }); }
                        )
                    }
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
 
    render() {

        const {
            customerFirstName,
            customerLastName,
            customerPhoneNumber,
            customerCounty,
            customerCity,
            customerEmail,
            loadingVisible,
            saveloadingVisible,
            showNotification,
            internetStatus,
        } = this.state    
    
        return (
        <KeyboardAvoidingView style={{ backgroundColor:'white', flex:1}}>

            { 
            
            loadingVisible ?  null :
            
            internetStatus ?

            <ScrollView 
                keyboardShouldPersistTaps='handled'
                style={{backgroundColor:'transparent', flex:1}}>

                <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 15}}>
                First Name
                </Text>

                {this.renderFirstName(customerFirstName)}

                <Text style={{color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 15}}>
                Last Name
                </Text>

                {this.renderLastName(customerLastName)}

                <Text style={{color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 15}}>
                Phone Number
                </Text>

                {this.renderPhoneNumber(customerPhoneNumber)}
                
                <Text style={{color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 15}}>
                Email
                </Text>

                {this.renderEmail(customerEmail)}

                <Text style={{color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 15}}>
                Home Address
                </Text>

                {this.renderHomeAddress(customerCity)}
                
                <Text style={{color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 15}}>
                County
                </Text>

                {this.renderCounty(customerCounty? customerCounty : '')}

            </ScrollView>

            :

            this.renderNoInternetView()}

            <Loader
                modalVisible={loadingVisible}
                animationType="fade"
            />

            <Loader
                modalVisible={saveloadingVisible}
                animationType="fade"
            />

            <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, marginTop: showNotification ? 10 : 0 }}>
                <Notification
                showNotification={showNotification}
                handleCloseNotification={this.handleCloseNotification}
                type="Error"
                firstLine = {this.state.firsterrorline !== "" ? "Unfortunately, some errors occured." : this.state.firsterrorline}
                secondLine={this.state.seconderrorline !== "" ? "Please try again." : this.state.seconderrorline}
                />
            </View>

        </KeyboardAvoidingView >

        )
    }
}


const mapStateToProps = state => ({
    getJWTToken: state.getJWTToken,
    getRefreshToken: state.getRefreshToken,
    getUserid: state.getUserid,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

MyDetails.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyDetails);


