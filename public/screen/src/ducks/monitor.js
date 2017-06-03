import { combineReducers } from 'redux';
import { ACTION_PREFIX } from '../strings';
// API

// REDUCER MOUNT POINT
const reducerMountPoint = 'monitor';
// ACTIONS
export const FETCH_MONITOR_SUCCESS = `${ACTION_PREFIX}FETCH_MONITOR_SUCCESS`;
// SCHEMA
// REDUCERS
const value = (state = null, action) => {
  switch (action.type) {
    case FETCH_MONITOR_SUCCESS:
      return action.response;
    default:
      return state;
  }
};
export default combineReducers({
  value,
});
// ACCESSORS AKA SELECTORS
export const getMonitor = (state) => state[reducerMountPoint].value;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const setMonitor = response => ({
  type: FETCH_MONITOR_SUCCESS,
  response,
});
