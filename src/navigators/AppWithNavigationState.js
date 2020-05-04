
import React, { Component } from 'react';
import { compose, createStore, applyMiddleware } from 'redux';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
} from 'react-navigation-redux-helpers';
import {
  BackHandler,
  DeviceEventEmitter,
} from 'react-native'
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { connect } from 'react-redux';
import AppRouteConfigs from './AppRouteConfigs';
import { addListener } from '../redux/reducers';
import {
  addNavigationHelpers,
  NavigationActions,
} from "react-navigation";


const mapStateToProps = state => ({
  state: state.nav,
});


class AppWithNavigationState extends React.Component {

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }
  onBackPress = () => {
    const { dispatch, state } = this.props;
    if (state.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {  
    const { state, dispatch } = this.props;
   
    return (
        <AppRouteConfigs navigation={{
          dispatch: dispatch,
          state: state,
          addListener,
       }} />
    );
  }
}


export default connect(mapStateToProps)(AppWithNavigationState);
