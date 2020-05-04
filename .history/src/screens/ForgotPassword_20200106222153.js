/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import InputField from '../components/form/InputField';
import Notification from '../components/Notification';
import NextArrowButton from '../components/buttons/NextArrowButton';
import Loader from '../components/Loader';
import styles from './styles/ForgotPassword';
import VerificationModal from '../components/VerificationModal';

const loginPhoto = require('../img/login_wallpaper.jpg');

export default class ForgotPassword extends Component {
  static navigationOptions = ({ navigation }) => ({
    /*headerLeft: <NavBarButton
      handleButtonPress={() => navigation.goBack()}
      location="left"
      icon={<Icon name="angle-left" color={colors.white} size={30} />}
    />,*/
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerTintColor: colors.white,
  });

  constructor(props) {
    super(props);
    this.state = {
      showNotification: false,
      loadingVisible: false,
      validEmail: false,
      emailAddress: '',
      showVerificationModal: false,
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.goToNextStep = this.goToNextStep.bind(this);
    this.handleCloseNotification = this.handleCloseNotification.bind(this);
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

  goToNextStep() {
    const { emailAddress } = this.state;
    this.setState({ loadingVisible: true });

   /* var auth = firebase.auth();
    
    auth.sendPasswordResetEmail(emailAddress).then(() => {
      // Email sent.
      this.setState({
        loadingVisible: false,
        showVerificationModal: true,
      });
    }).catch((error) => {
      // An error happened.
      this.setState({
        loadingVisible: false,
        showNotification: true,
      });
    });*/
  }

  onOKPressed = () => {

    this.setState({ showVerificationModal: false });
  }


  onResendPressed =() => {
    this.setState(
      { loadingVisible: true, showVerificationModal: false}
      , () => {
        this.goToNextStep();
    });
  }

  handleCloseNotification() {
    this.setState({ showNotification: false });
  }

  render() {
    const { loadingVisible, showNotification, validEmail, showVerificationModal } = this.state;
    return (
      <KeyboardAvoidingView
        style={[{ backgroundColor: 'black' }, styles.wrapper]}
      >
       <ImageBackground source={loginPhoto} style={{width: '100%', height: '100%'}}>

        <View style={styles.scrollViewWrapper}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.forgotPasswordHeading}>
Forgot your password?
            </Text>
            <Text style={styles.forgotPasswordSubheading}>
Enter your email to find your account
            </Text>
            <InputField
              customStyle={{ marginBottom: 30 }}
              textColor={colors.white}
              labelText="EMAIL ADDRESS"
              labelTextSize={14}
              labelColor={colors.white}
              borderBottomColor="rgba(255,255,255,0.5)"
              inputType="email"
              onChangeText={this.handleEmailChange}
              showCheckmark={validEmail}
            />
          </ScrollView>
          <NextArrowButton
            handleNextButton={this.goToNextStep}
            disabled={!validEmail}
          />
        </View>
        <Loader
          modalVisible={loadingVisible}
          animationType="fade"
        />
        <VerificationModal
          modalVisible={showVerificationModal}
          animationType="fade"
          txtmsg={"Password reset email has been sent to your registered email address. Please reset your password at there."}
          handleOnPress={this.onOKPressed.bind(this)}
          handleOnResendPress={this.onResendPressed.bind(this)}
        />
        <View style={styles.notificationWrapper}>
          <Notification
            showNotification={showNotification}
            handleCloseNotification={this.handleCloseNotification}
            type="Error"
            firstLine="No account exists for the requested"
            secondLine="email address."
          />
        </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}
