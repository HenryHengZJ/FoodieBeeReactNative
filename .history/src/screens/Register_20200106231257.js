
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  Keyboard,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import ActionCreators from '../redux/actions';
import colors from '../styles/colors';
import apis from '../apis';
import img from '../img/s3'
import transparentHeaderStyle from '../styles/navigation';
import InputField from '../components/form/InputField';
import SelectField from '../components/form/SelectField';
import NextArrowButton from '../components/buttons/NextArrowButton';
import Notification from '../components/Notification';
import Loader from '../components/Loader';
import NavBarButton from '../components/buttons/NavBarButton';
import SignUpButton from '../components/buttons/SignUpButton';
import deviceStorage from '../helpers/deviceStorage';
import styles from './styles/LogIn';

import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

const loginPhoto = require('../img/login_wallpaper.jpg');

class Register extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerTintColor: colors.white,
  });

  constructor(props) {
    super(props);
    this.state = {
      showNotification: false,

      validFirstName: false,
      customerFirstName: '',

      validLastName: false,
      customerLastName: '',

      validEmail: false,
      customerEmail: '',

      validPhoneNumber: false,
      customerPhoneNumber: '',

      validPassword: false,
      password: '',

      validRepeatPassword: false,
      repeatpassword: '',

      loadingVisible: false,
      errormsg: null,
      companyName: "",
      companyID: "",
    };

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
    this.onSearchCompanyClose = this.onSearchCompanyClose.bind(this);

    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
 
  }

  onSearchCompanyClicked = (navigation) => {
    navigation.navigate('SearchCompany', { 
      onSearchCompanyClose: this.onSearchCompanyClose 
    });
  }

  onSearchCompanyClose( companyID, companySearchText ) {
    this.setState({
        companyID,
        companyName: companySearchText
    });  
  }

  handleCloseNotification() {
    this.setState({ showNotification: false });
  }

  handleFirstNameChange(firstname) {
    this.setState({ customerFirstName: firstname, validFirstName: firstname === "" ? false : true });
  }

  handleLastNameChange(lastname) {
    this.setState({ customerFirstName: lastname, validLastName: lastname === "" ? false : true });
  }

  handlePhoneNumberChange(phonenumber) {
    if (phonenumber.substring(0,3) === '353' || phonenumber.substring(0,1) !== '0' || phonenumber.includes("+") || phonenumber.includes("-") || phonenumber.includes(".") || phonenumber.includes("*") || phonenumber.includes("#")) {
      this.setState({
        validPhoneNumber: false,
      });
    }
    else if(phonenumber.length > 10 || phonenumber.length < 9) {
      this.setState({
        validPhoneNumber: false,
      });
    }
    else {
      this.setState({
        customerPhoneNumber: phonenumber,
        validPhoneNumber: true,
      });
    }
  }

  handleEmailChange(email) {
    // eslint-disable-next-line
    const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validEmail } = this.state;
    this.setState({ emailAddress: email });

    if (!validEmail) {
      if (emailCheckRegex.test(email)) {
        this.setState({ validEmail: true });
      }
    } else if (!emailCheckRegex.test(email)) {
      this.setState({ validEmail: false });
    }
  }

  handlePasswordChange(password) {
    const { validPassword } = this.state;

    this.setState({ password });

    if (!validPassword) {
      if (password.length > 4) {
        // Password has to be at least 4 characters long
        this.setState({ validPassword: true });
      }
    } else if (password <= 4) {
      this.setState({ validPassword: false });
    }
  }

  handleRepeatPasswordChange(repeatpassword) {

    this.setState({ repeatpassword });

    if (repeatpassword.length <= 4) {
      // Password has to be at least 4 characters long
      this.setState({ validRepeatPassword: false });
    } 
    else if (repeatpassword > 4) {
      if (repeatpassword === this.state.password) {
        // Password has to be at least 4 characters long
        this.setState({ validRepeatPassword: true });
      }
      else {
        this.setState({ validRepeatPassword: false });
      }
    }
  }

  toggleNextButtonState() {
    const { validFirstName, validLastName, validEmail, validPhoneNumber, validPassword, validRepeatPassword, companyName, companyID } = this.state;
    if ( validFirstName && validLastName && validEmail && validPhoneNumber && validPassword && validRepeatPassword && companyName !== "" && companyID !== "") {
      return false;
    }
    return true;
  }

  onCreateAccount = () => {

    Keyboard.dismiss();

    this.setState({loadingVisible: true})

    const { customerFirstName, customerLastName, customerEmail, customerPhoneNumber, customerPassword, companyID } = this.state;

    var headers = {
      'Content-Type': 'application/json',
    }

    var body = {
      customerFirstName: customerFirstName,
      customerLastName: customerLastName,
      customerEmail: customerEmail,
      customerPhoneNumber: customerPhoneNumber,
      customerPassword: customerPassword,
      customerCompanyID: companyID,
      customerCountry: "Ireland",
      customerCountryCode: "+353"
    }

    var url = apis.POSTcustomersignup;

    axios.post(url, body, {headers: headers})
    .then((response) => {
      if (response.status === 200) {
        this.loginRegisteredUser();
      } 
    })
    .catch((error) => {
      if (error) {
        var errormsg = ""
        if (error.response.data.message === 'email existed') {
          errormsg = "Email existed. Please try with another email address."
        }
        else {
          errormsg = "Error creating account. Please try again"
        }
        this.setState({
          showNotification: true,
          loadingVisible: false,
          errormsg,
        })
      } 
    });
  }

  loginRegisteredUser = () => {
  
    const { navigation, setUID, setJWT, setRefreshToken } = this.props;
    const { customerEmail, customerPassword } = this.state;

    var data = {
      email: customerEmail,
      password: customerPassword
    }

    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.POSTcustomerlogin;

    axios.post(url, data, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
 
          deviceStorage.saveItem("userid", response.data.customerID);
          setUID(response.data.customerID)
          deviceStorage.saveItem("jwttoken", response.headers['x-auth']);
          setJWT(response.headers['x-auth'])
          deviceStorage.saveItem("refreshtoken",  response.data.refreshToken);
          setRefreshToken(response.data.refreshToken)
   
          this.setState({ showNotification: true, loadingVisible: false, errormsg: null});
          navigation.navigate('Home')
        }
      })
      .catch((error) => {
        this.setState({ showNotification: true, loadingVisible: false, errormsg: "Error logging in new account" });
      });
  }

  render() {
    const {
      showNotification, loadingVisible, validFirstName, validLastName, validEmail, validPhoneNumber, validPassword, validRepeatPassword, errormsg,
    } = this.state;

    const notificationMarginTop = showNotification ? 10 : 0;

    return (
      <KeyboardAvoidingView
        style={[{ backgroundColor: 'black' }, styles.wrapper]}
      >
       <ImageBackground source={loginPhoto} style={{width: '100%', height: '100%'}}>

        <View style={[styles.scrollViewWrapper]}>
          <ScrollView 
            keyboardShouldPersistTaps='handled'
            style={[styles.scrollView, { marginBottom: 10 }]}>
            <Text style={styles.loginHeader}>
              Register
            </Text>
            <InputField
              labelText="FIRST NAME"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor="rgba(255,255,255,0.5)"
              inputType="email"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleFirstNameChange}
              showCheckmark={validFirstName}
            />
            <InputField
              labelText="LAST NAME"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor="rgba(255,255,255,0.5)"
              inputType="email"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleLastNameChange}
              showCheckmark={validLastName}
            />
            <InputField
              labelText="EMAIL ADDRESS"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor="rgba(255,255,255,0.5)"
              inputType="email"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleEmailChange}
              showCheckmark={validEmail}
            />
            <InputField
              labelText="PHONE NUMBER"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor="rgba(255,255,255,0.5)"
              inputType="number"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handlePhoneNumberChange}
              showCheckmark={validPhoneNumber}
            />
            <InputField
              labelText="PASSWORD"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor="rgba(255,255,255,0.5)"
              inputType="password"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handlePasswordChange}
              showCheckmark={validPassword}
            />
            <InputField
              labelText="REPEAT PASSWORD"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor="rgba(255,255,255,0.5)"
              inputType="password"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleRepeatPasswordChange}
              showCheckmark={validRepeatPassword}
            />
            <SelectField
              labelText="COMPANY"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor="rgba(255,255,255,0.5)"
              customStyle={{ marginBottom: 50 }}
              value={this.state.companyName}
              handleOnPress={this.onSearchCompanyClicked.bind(this, this.props.navigation)}
            />

          </ScrollView>

          <NextArrowButton
            handleNextButton={this.onCreateAccount.bind(this)}
            disabled={this.toggleNextButtonState()}
          />
          
        </View>

        <Loader
          modalVisible={loadingVisible}
          animationType="fade"
        />

        <View style={[styles.notificationWrapper, { marginTop: notificationMarginTop }]}>
          <Notification
            showNotification={showNotification}
            handleCloseNotification={this.handleCloseNotification}
            type="Error"
            firstLine = {errormsg ? errormsg : "Unfortunately, an error occured."}
            secondLine="Please try again."
          />
        </View>

        </ImageBackground>

      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  getJWTToken: state.getJWTToken,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

Register.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setRefreshToken: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
