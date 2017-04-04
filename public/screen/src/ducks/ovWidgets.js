import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
import { ServerException } from '../util/exceptions';
// API
import { get } from '../apis/ovWidgets';

// REDUCER MOUNT POINT
const reducerMountPoint = 'ovWidgets';
// ACTIONS
export const FETCH_OV_WIDGETS_REQUEST = `${ACTION_PREFIX}FETCH_OV_WIDGETS_REQUEST`;
export const FETCH_OV_WIDGETS_SUCCESS = `${ACTION_PREFIX}FETCH_OV_WIDGETS_SUCCESS`;
export const FETCH_OV_WIDGETS_ERROR = `${ACTION_PREFIX}FETCH_OV_WIDGETS_ERROR`;
export const RESET_FETCH_OV_WIDGETS_ERROR = `${ACTION_PREFIX}RESET_FETCH_OV_WIDGETS_ERROR`;
export const RESET_OV_WIDGETS = `${ACTION_PREFIX}RESET_OV_WIDGETS`;
// SCHEMA
const slideDeckSchema = new Schema('ovWidgets');
const ovWidgetsSchema = arrayOf(slideDeckSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_OV_WIDGETS_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.ovWidgets,
      };
    }
    case RESET_OV_WIDGETS: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_OV_WIDGETS_SUCCESS:
      return action.response.result;
    case RESET_OV_WIDGETS:
      return [];
    default:
      return state;
  }
};
const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_OV_WIDGETS_REQUEST:
      return true;
    case FETCH_OV_WIDGETS_SUCCESS:
    case FETCH_OV_WIDGETS_ERROR:
      return false;
    default:
      return state;
  }
};
const fetchErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_OV_WIDGETS_ERROR:
      return action.message;
    case FETCH_OV_WIDGETS_REQUEST:
    case FETCH_OV_WIDGETS_SUCCESS:
      return null;
    default:
      return state;
  }
};
export default combineReducers({
  byId,
  ids,
  isFetching,
  fetchErrorMessage,
});
// ACCESSORS AKA SELECTORS
export const getSlideDeck = (state, id) => state[reducerMountPoint].byId[id];
const getOvWidgetsIds = state => state[reducerMountPoint].ids;
const getOvWidgetsById = state => state[reducerMountPoint].byId;
export const getOvWidgets = createSelector(
  [getOvWidgetsIds, getOvWidgetsById],
  (ovWidgetsIds, ovWidgetsById) => ovWidgetsIds.map(id => ovWidgetsById[id])
);
export const getIsFetchingOvWidgets = (state) => state[reducerMountPoint].isFetching;
export const getFetchOvWidgetsErrorMessage = (state) => state[reducerMountPoint].fetchErrorMessage;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchOvWidgets = () => (dispatch, getState) => {
  if (getIsFetchingOvWidgets(getState())) throw new Error();
  dispatch({
    type: FETCH_OV_WIDGETS_REQUEST,
  });
  return get()
    .then(
      response => dispatch({
        type: FETCH_OV_WIDGETS_SUCCESS,
        response: normalize(response, ovWidgetsSchema),
      }),
      error => {
        dispatch({
          type: FETCH_OV_WIDGETS_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchOvWidgetsError = () => ({
  type: RESET_FETCH_OV_WIDGETS_ERROR,
});
export const resetOvWidgets = () => ({
  type: RESET_OV_WIDGETS,
});
