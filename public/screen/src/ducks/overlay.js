import { combineReducers } from 'redux';
import { ACTION_PREFIX } from '../strings';
// API

// REDUCER MOUNT POINT
const reducerMountPoint = 'overlay';
// ACTIONS
export const FETCH_OVERLAY_SUCCESS = `${ACTION_PREFIX}FETCH_OVERLAY_SUCCESS`;
// SCHEMA
// REDUCERS
const value = (state = null, action) => {
  switch (action.type) {
    case FETCH_OVERLAY_SUCCESS:
      return action.response;
    default:
      return state;
  }
};
export default combineReducers({
  value,
});
// ACCESSORS AKA SELECTORS
export const getOverlay = (state) => state[reducerMountPoint].value;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const setOverlay = response => ({
  type: FETCH_OVERLAY_SUCCESS,
  response,
});
