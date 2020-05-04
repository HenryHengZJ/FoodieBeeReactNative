
import React, { Component, PureComponent } from 'react';
import { compose, createStore, applyMiddleware } from 'redux';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
} from 'react-navigation-redux-helpers';
import {
  BackHandler,
  DeviceEventEmitter,
  StatusBar, 
  Platform,
  Alert,
  ToastAndroid,
} from 'react-native'
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { connect } from 'react-redux';
import AppRouteConfigs from './AppRouteConfigs';
//import AppWithNavigationState from './AppWithNavigationState';
import reducer from '../redux/reducers';
//import {middleware} from '../redux/reducers';
import { NavigationActions, createStackNavigator } from 'react-navigation';
import RNExitApp from 'react-native-exit-app';

const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);

const ReduxAppNavigator = reduxifyNavigator(AppRouteConfigs, 'root');

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

const configureStore = (initialState) => {
  const enhancer = compose(
    applyMiddleware(
      middleware,
      thunkMiddleware,
      loggerMiddleware,
    ),
  );
  return createStore(reducer, initialState, enhancer);
};

// create nav component
class ReduxNavigation extends PureComponent {
  /*componentDidMount() {
    console.log("ReduxNavigation componentDidMount ")
    BackHandler.addEventListener('hardwareBackPress',() => {
      alert("backedddd")
      return true
    })
  }

  componentWillUnmount() {
    console.log("ReduxNavigation componentWillUnmount ")
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, state } = this.props;
    console.log("back pressed = " + state.index)
    alert("gg")
  
    if (state.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };*/

  constructor(props) {
    super(props);
    this.backPressSubscriptions = new Set()
  }

  componentDidMount() {

    console.log("ReduxNavigation componentDidMount")
    
    DeviceEventEmitter.removeAllListeners('hardwareBackPress')
    DeviceEventEmitter.addListener('hardwareBackPress', () => {
      let invokeDefault = true
      const subscriptions = []

      this.backPressSubscriptions.forEach(sub => subscriptions.push(sub))
   
      for (let i = 0; i < subscriptions.reverse().length; i += 1) {
        if (subscriptions[i]()) {
          invokeDefault = false
          break
        }
      }

      if (invokeDefault) {
        BackHandler.exitApp()
      }
    })

    this.backPressSubscriptions.add(this.handleHardwareBack)

  }

  componentWillUnmount() {
    console.log("ReduxNavigation componentWillUnmount")
    DeviceEventEmitter.removeAllListeners('hardwareBackPress')
    this.backPressSubscriptions.clear()
  }


  handleHardwareBack = () => { 
    console.log("ReduxNavigation handleHardwareBack")
    const { dispatch, state, navigation } = this.props;
    const { routes, index } = state
    console.log("back pressed index = " + state.index )
    const currentRoute = routes[index];
    console.log("back pressed currentRoute = " + JSON.stringify(currentRoute) )
    const currentRouteName = currentRoute.routeName;
    console.log("back pressed currentRouteName = " + currentRouteName )
    const currentRouteKey = currentRoute.key;
    console.log("back pressed currentRouteKey = " + currentRouteKey )
   // const currentRoute2 = currentRoute.routes[0]
   // console.log("back pressed currentRoute2 = " + JSON.stringify(currentRoute2) )
   // const currentRouteindex = currentRoute.routes[0].index
   // console.log("back pressed currentRouteindex = " + currentRouteindex )

   //alert(JSON.stringify(state))

    if (currentRouteName === "Home") {
      RNExitApp.exitApp();
      return true;
    }
    else if (currentRouteName === "MyDetails") {
      alert("gg la")
    }
    else {
      dispatch(NavigationActions.back());
    }

    return true;

  }

  render() {
    const { dispatch, state } = this.props;
    return <ReduxAppNavigator dispatch={dispatch} state={state} />;
  }
}

const mapStateToProps = state => ({
  state: state.nav,
});

const AppWithNavigationState = connect(mapStateToProps)(ReduxNavigation);

class Root extends Component {

  render() {  
    return <AppWithNavigationState 
   
    />;
  }
}

export {
  configureStore,
  Root,
};
