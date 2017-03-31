import { combineReducers } from 'redux';
import { ACTION_PREFIX } from '../strings';

// API
import { get } from '../apis/monitor';
// REDUCER MOUNT POINT
const reducerMountPoint = 'monitor';
// ACTIONS
export const FETCH_MONITOR_REQUEST = `${ACTION_PREFIX}FETCH_MONITOR_REQUEST`;
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
const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_MONITOR_REQUEST:
      return true;
    case FETCH_MONITOR_SUCCESS:
      return false;
    default:
      return state;
  }
};
export default combineReducers({
  value,
  isFetching,
});
// ACCESSORS AKA SELECTORS
export const getMonitor = (state) => state[reducerMountPoint].value;
export const getIsFetchingMonitor = (state) => state[reducerMountPoint].isFetching;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchMonitor = () => (dispatch, getState) => {
  const state = getState();
  if (getIsFetchingMonitor(state)) throw new Error();
  dispatch({
    type: FETCH_MONITOR_REQUEST,
  });
  return get()
    .then(
      response => dispatch({
        type: FETCH_MONITOR_SUCCESS,
        response,
      }).response
    );
};
