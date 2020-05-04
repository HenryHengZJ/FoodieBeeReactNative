
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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../redux/actions';
import colors from '../styles/colors';
import apis from '../apis';
import img from '../img/s3'
import transparentHeaderStyle from '../styles/navigation';
import InputField from '../components/form/InputField';
import NextArrowButton from '../components/buttons/NextArrowButton';
import Notification from '../components/Notification';
import Loader from '../components/Loader';
import NavBarButton from '../components/buttons/NavBarButton';
import SignUpButton from '../components/buttons/SignUpButton';
import deviceStorage from '../helpers/deviceStorage';
import styles from './styles/LogIn';
import { NavigationActions, StackActions } from 'react-navigation';
import axios from 'axios';

const loginPhoto = require('../img/login_wallpaper.jpg');

const navigateToForgotPassword = NavigationActions.navigate({
  routeName: 'ForgotPassword',
});

const navigateToCreateProfileName = NavigationActions.navigate({
  routeName: 'CreateProfileName',
});

const navigateToTabsAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'LoggedIn'})
  ] 
})

class LogIn extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: <NavBarButton
      handleButtonPress={() => navigation.dispatch(navigateToForgotPassword)}
      location="right"
      color={colors.white}
      text="Forgot Password"
    />,
    
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerTintColor: colors.white,
  });

  constructor(props) {
    super(props);
    this.state = {
      showNotification: false,
      validEmail: false,
      emailAddress: '',
      password: '',
      validPassword: false,
      loadingVisible: false,
      errormsg: null,
    };

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
  }

  handleNextButton() {
    Keyboard.dismiss();
    this.setState({ loadingVisible: true });
    const { navigation } = this.props;
    const { emailAddress, password } = this.state;

    var data = {
      email: emailAddress,
      password: password
    }

  //  alert(JSON.stringify(data))

    var headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    var url = apis.POSTcustomerlogin;

   // alert(url)

    axios.post(url, data, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          alert(response.data.customerID)
          deviceStorage.saveItem("userid", response.data.customerID);
          setUID(response.data.customerID)
          this.setState({ showNotification: true, loadingVisible: false, errormsg: null});
          navigation.navigate('Home')
        }
      })
      .catch((error) => {
        alert(error)
        this.setState({ showNotification: true, loadingVisible: false, errormsg: "Invalid credentials" });
      });
  }

  handleCloseNotification() {
    this.setState({ showNotification: false });
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

  toggleNextButtonState() {
    const { validEmail, validPassword } = this.state;
    if (validEmail && validPassword) {
      return false;
    }
    return true;
  }

  onCreateAccountPress = (navigation) => {
    //alert('Create Account button pressed');
    navigation.dispatch(navigateToCreateProfileName);
  }

  render() {
    const {
      showNotification, loadingVisible, validEmail, validPassword, errormsg,
    } = this.state;

    const notificationMarginTop = showNotification ? 10 : 0;
    return (
      <KeyboardAvoidingView
        style={[{ backgroundColor: 'black' }, styles.wrapper]}
      >

       <ImageBackground source={loginPhoto} style={{width: '100%', height: '100%'}}>

        <View style={styles.scrollViewWrapper}>
          <ScrollView 
            keyboardShouldPersistTaps='handled'
            style={styles.scrollView}>
            <Text style={styles.loginHeader}>
              Log In
            </Text>
            <InputField
              labelText="EMAIL ADDRESS"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={colors.white}
              inputType="email"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleEmailChange}
              showCheckmark={validEmail}
            />
            <InputField
              labelText="PASSWORD"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={colors.white}
              inputType="password"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handlePasswordChange}
              showCheckmark={validPassword}
            />

           
            <Text style={styles.noAccText}>
                No Account?
            </Text>

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <SignUpButton 
                handleNextButton={this.onCreateAccountPress.bind(this, this.props.navigation)}>
              </SignUpButton>
            </View>

           

          </ScrollView>
          <NextArrowButton
            handleNextButton={this.handleNextButton}
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
            firstLine = {errormsg ? errormsg : "These credentials don't look right."}
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

LogIn.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);
