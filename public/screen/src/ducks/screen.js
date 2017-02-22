import { combineReducers } from 'redux';
import { ACTION_PREFIX, SCREEN_ID } from '../strings';
import { ServerException } from '../util/exceptions';
// API
import { get } from '../apis/screen';
// REDUCER MOUNT POINT
const reducerMountPoint = 'screen';
// ACTIONS
export const FETCH_SCREEN_REQUEST = `${ACTION_PREFIX}FETCH_SCREEN_REQUEST`;
export const FETCH_SCREEN_SUCCESS = `${ACTION_PREFIX}FETCH_SCREEN_SUCCESS`;
export const FETCH_SCREEN_ERROR = `${ACTION_PREFIX}FETCH_SCREEN_ERROR`;
export const RESET_FETCH_SCREEN_ERROR = `${ACTION_PREFIX}RESET_FETCH_SCREEN_ERROR`;
// SCHEMA
// REDUCERS
const value = (state = {
  id: SCREEN_ID,
  subscribedPlaylistIds: [],
}, action) => {
  switch (action.type) {
    case FETCH_SCREEN_SUCCESS:
      return action.response;
    default:
      return state;
  }
};
const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_SCREEN_REQUEST:
      return true;
    case FETCH_SCREEN_SUCCESS:
    case FETCH_SCREEN_ERROR:
      return false;
    default:
      return state;
  }
};
const fetchErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_SCREEN_ERROR:
      return action.message;
    case FETCH_SCREEN_REQUEST:
    case FETCH_SCREEN_SUCCESS:
    case RESET_FETCH_SCREEN_ERROR:
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
export const getScreen = (state) => state[reducerMountPoint].value;
export const getIsFetchingScreen = (state) => state[reducerMountPoint].isFetching;
export const getFetchScreenErrorMessage = (state) => state[reducerMountPoint].fetchErrorMessage;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchScreen = () => (dispatch, getState) => {
  const state = getState();
  if (getIsFetchingScreen(state)) throw new Error();
  const screen = getScreen(state);
  dispatch({
    type: FETCH_SCREEN_REQUEST,
  });
  return get(screen.id)
    .then(
      response => dispatch({
        type: FETCH_SCREEN_SUCCESS,
        response,
      }).response,
      error => {
        dispatch({
          type: FETCH_SCREEN_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchScreenError = () => ({
  type: RESET_FETCH_SCREEN_ERROR,
});
