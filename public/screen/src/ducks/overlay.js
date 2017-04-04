import { combineReducers } from 'redux';
import { ACTION_PREFIX } from '../strings';
// API
import { get } from '../apis/overlay';

// REDUCER MOUNT POINT
const reducerMountPoint = 'overlay';
// ACTIONS
export const FETCH_OVERLAY_REQUEST = `${ACTION_PREFIX}FETCH_OVERLAY_REQUEST`;
export const FETCH_OVERLAY_SUCCESS = `${ACTION_PREFIX}FETCH_OVERLAY_SUCCESS`;
export const FETCH_OVERLAY_ERROR = `${ACTION_PREFIX}FETCH_OVERLAY_ERROR`;
export const RESET_FETCH_OVERLAY_ERROR = `${ACTION_PREFIX}RESET_FETCH_OVERLAY_ERROR`;
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
const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_OVERLAY_REQUEST:
      return true;
    case FETCH_OVERLAY_SUCCESS:
    case FETCH_OVERLAY_ERROR:
      return false;
    default:
      return state;
  }
};
const fetchErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_OVERLAY_ERROR:
      return action.message;
    case FETCH_OVERLAY_REQUEST:
    case FETCH_OVERLAY_SUCCESS:
    case RESET_FETCH_OVERLAY_ERROR:
      return null;
    default:
      return state;
  }
};
export default combineReducers({
  value,
  isFetching,
  fetchErrorMessage,
});
// ACCESSORS AKA SELECTORS
export const getOverlay = (state) => state[reducerMountPoint].value;
export const getIsFetchingOverlay = (state) => state[reducerMountPoint].isFetching;
export const getFetchOverlayErrorMessage = (state) => state[reducerMountPoint].fetchErrorMessage;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchOverlay = (id) => (dispatch, getState) => {
  const state = getState();
  if (getIsFetchingOverlay(state)) throw new Error();
  dispatch({
    type: FETCH_OVERLAY_REQUEST,
  });
  return get(id)
    .then(
      response => dispatch({
        type: FETCH_OVERLAY_SUCCESS,
        response,
      }).response
    );
};
export const resetFetchOverlayError = () => ({
  type: RESET_FETCH_OVERLAY_ERROR,
});
