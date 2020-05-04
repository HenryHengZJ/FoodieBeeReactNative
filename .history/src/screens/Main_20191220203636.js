
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  Animated,
  Image,
  BackHandler,
  DeviceEventEmitter,
  AsyncStorage,
  Linking ,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../redux/actions';
import { NavigationActions, StackActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info'; 

import axios from 'axios';
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import apis from '../apis';

/*const navigateToHomeAction = NavigationActions.navigate({
  routeName: 'LoggedIn',
});

const navigateToLoggedOut = NavigationActions.navigate({
  routeName: 'LoggedOut',
});*/

const appsVersion = DeviceInfo.getVersion();
const appsBuildNumber = DeviceInfo.getBuildNumber();

const navigateToHomeAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Home'})
  ] 
})

class Main extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerStyle: {transparentHeaderStyle},
    headerTransparent: true,
    headerTintColor: colors.white,
   
  });
 
  constructor(props) {
    super(props);
    this.state = {
      springVal: new Animated.Value(0.8),
      fadeVal: new Animated.Value(1),
    };

    console.disableYellowBox = true;

  }

  spring = ( update, AndroidUpdateType) => {
  
    Animated.sequence([
      Animated.spring(this.state.springVal, {
        toValue: 0.6,
        friction: 10,
        tension: 50
      }),
      Animated.parallel([
        Animated.spring(this.state.springVal, {
          toValue: 17.5,
          friction: 70,
          tension: 350
        }),
        Animated.timing(this.state.fadeVal, {
          toValue: 0,
          duration: 200,
        })
      ])
    ]).start(() =>
    {
      update?  
      this.props.navigation.navigate({
        routeName: 'UpdateView',
        params: {
          type: AndroidUpdateType,
        },
      })  
      :
      this.props.navigation.dispatch(navigateToHomeAction)
    });
  }


  loadAppVersion = () => {
    var url = apis.GETAppsVersion_BASEURL;

    axios.get(url)
    .then((response) => {

      console.log("data = " + JSON.stringify(response.data) );

      var AndroidUpdateType = response.data[0].AndroidUpdateType;
      var AndroidVersion = response.data[0].AndroidVersion;

      if (appsVersion !== AndroidVersion) {
        //Promot user to update apps
        this.spring(true, AndroidUpdateType);
      }
      else {
        this.spring(false, null);
      }

    })
    .catch((error) => {
      console.log(error);
      this.spring( false, null);
    });
  }

  _loadInitialState = async (setJWT, setUID) => {
    try {
      const useridvalue = await AsyncStorage.getItem('userid');
      if (useridvalue !== null ) {
        setUID(useridvalue);
        setJWT(jwtvalue);
      }
    } catch (error) {
    }
    this.loadAppVersion();
  };

  componentWillMount() {

    const {setJWT, setUID} = this.props;

    this._loadInitialState(setJWT, setUID).done();

  }

  render() {

      return (

        <View style={styles.wrapper}>

        <StatusBar translucent backgroundColor='transparent' barStyle='light-content' />

          <View style={styles.center}>
            <Animated.Image
              style={{
                height: 180,
                width: 180,
                
                opacity: this.state.fadeVal,
                transform: [{ scale: this.state.springVal }]
                
              }}
              source={require('../img/FoodieBee_logo.png')}
            >
             
            </Animated.Image>
          </View>
        </View>

      ); // Render loading/splash screen etc
  

  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: colors.backgroundblue
  },
  center: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
});

const mapStateToProps = state => ({
  getJWTToken: state.getJWTToken,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

Main.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

