
import * as types from './types';
import user from '../../helpers/user.json';

const setJWT = jwttoken => (
  {
    type: types.SET_JWT,
    jwttoken,
  }
);

const setUID = userid => (
  {
    type: types.SET_UID,
    userid,
  }
);

const setSocket = socket => (
  {
    type: types.SET_SOCKET,
    socket,
  }
);

const setSavedJob = savedjob => (
  {
    type: types.SET_SAVED_JOB,
    savedjob,
  }
);

const setAppliedJob = appliedjob => (
  {
    type: types.SET_APPLIED_JOB,
    appliedjob,
  }
);

const setPendingApplicant = pendingapplicant => (
  {
    type: types.SET_PENDING_APPLICANT,
    pendingapplicant,
  }
);

const setHiredApplicant = hiredapplicant => (
  {
    type: types.SET_HIRED_APPLICANT,
    hiredapplicant,
  }
);

const setRejectedApplicant = rejectedapplicant => (
  {
    type: types.SET_REJECTED_APPLICANT,
    rejectedapplicant,
  }
);

const setLoggedInState = loggedInState => (
  {
    type: types.SET_LOGGED_IN_STATE,
    loggedInState,
  }
);

const setAutoVerify = credential => (
  {
    type: types.SET_AUTO_VERIFY,
    credential,
  }
);

const setClosedJob = closedjob => (
  {
    type: types.SET_CLOSED_JOB,
    closedjob,
  }
);

const logIn = (email, password) => {
  const action = (dispatch) => {
    if (email === user.email && password === user.password) {
      dispatch(setLoggedInState(true));
      return true;
    }
    dispatch(setLoggedInState(false));
    return false;
  };
  return action;
};

export {
  setJWT,
  setUID,
  setSocket,
  setSavedJob,
  setAppliedJob,
  setPendingApplicant,
  setHiredApplicant,
  setRejectedApplicant,
  setAutoVerify,
  setClosedJob,
  logIn,
  setLoggedInState,
};
