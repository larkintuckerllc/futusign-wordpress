import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API
import { get } from '../apis/webs';

// REDUCER MOUNT POINT
const reducerMountPoint = 'webs';
// ACTIONS
export const FETCH_WEBS_REQUEST = `${ACTION_PREFIX}FETCH_WEBS_REQUEST`;
export const FETCH_WEBS_SUCCESS = `${ACTION_PREFIX}FETCH_WEBS_SUCCESS`;
export const RESET_WEBS = `${ACTION_PREFIX}RESET_WEBS`;
// SCHEMA
const layerSchema = new Schema('webs');
const websSchema = arrayOf(layerSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_WEBS_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.webs,
      };
    }
    case RESET_WEBS: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_WEBS_SUCCESS:
      return action.response.result;
    case RESET_WEBS:
      return [];
    default:
      return state;
  }
};
const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_WEBS_REQUEST:
      return true;
    case FETCH_WEBS_SUCCESS:
      return false;
    default:
      return state;
  }
};
export default combineReducers({
  byId,
  ids,
  isFetching,
});
// ACCESSORS AKA SELECTORS
export const getSlideDeck = (state, id) => state[reducerMountPoint].byId[id];
const getWebsIds = state => state[reducerMountPoint].ids;
const getWebsById = state => state[reducerMountPoint].byId;
export const getWebs = createSelector(
  [getWebsIds, getWebsById],
  (websIds, websById) => websIds.map(id => websById[id])
);
export const getIsFetchingWebs = (state) => state[reducerMountPoint].isFetching;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchWebs = (playlistIds) => (dispatch, getState) => {
  if (!Array.isArray(playlistIds)) throw new Error();
  if (getIsFetchingWebs(getState())) throw new Error();
  dispatch({
    type: FETCH_WEBS_REQUEST,
  });
  return get(playlistIds)
    .then(
      response => dispatch({
        type: FETCH_WEBS_SUCCESS,
        response: normalize(response, websSchema),
      })
    );
};
export const resetWebs = () => ({
  type: RESET_WEBS,
});
