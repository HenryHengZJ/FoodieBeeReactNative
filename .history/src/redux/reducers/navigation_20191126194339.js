

import { StatusBar } from 'react-native';
import createReducer from '../helpers/createReducer';
import * as types from '../actions/types';
import AppRouteConfigs from '../../navigators/AppRouteConfigs';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

const firstAction = AppRouteConfigs.router.getActionForPathAndParams('Main');
const initialNavState = AppRouteConfigs.router.getStateForAction(firstAction);

const loggedInStatus = createReducer({}, {
  [types.SET_LOGGED_IN_STATE](state, action) {
    return action;
  },
});

const getJWTToken = createReducer({}, {
  [types.SET_JWT](state, action) {
    return action;
  },
});

const getUserid = createReducer({}, {
  [types.SET_UID](state, action) {
    return action;
  },
});

const getSocket = createReducer({}, {
  [types.SET_SOCKET](state, action) {
    return action;
  },
});

const getSavedJob = createReducer({}, {
  [types.SET_SAVED_JOB](state, action) {
    return action;
  },
});

const getAppliedJob = createReducer({}, {
  [types.SET_APPLIED_JOB](state, action) {
    return action;
  },
});

const getPendingApplicant = createReducer({}, {
  [types.SET_PENDING_APPLICANT](state, action) {
    return action;
  },
});

const getHiredApplicant = createReducer({}, {
  [types.SET_HIRED_APPLICANT](state, action) {
    return action;
  },
});

const getRejectedApplicant = createReducer({}, {
  [types.SET_REJECTED_APPLICANT](state, action) {
    return action;
  },
});

const getAutoVerify = createReducer({}, {
  [types.SET_AUTO_VERIFY](state, action) {
    return action;
  },
});

const getClosedJob = createReducer({}, {
  [types.SET_CLOSED_JOB](state, action) {
    return action;
  },
});

const nav = (state = initialNavState, action) => {

  const nextState = AppRouteConfigs.router.getStateForAction(action, state);
 
  if (action.routeName === 'TurnOnNotifications' || action.routeName === 'LoggedIn') {
    StatusBar.setBarStyle('dark-content', true);
  }

  return nextState || state;
};

export {
  getJWTToken,
  getSocket,
  getUserid,
  getSavedJob,
  getAppliedJob,
  getPendingApplicant,
  getHiredApplicant,
  getRejectedApplicant,
  getAutoVerify,
  getClosedJob,
  loggedInStatus,
  nav,
};
