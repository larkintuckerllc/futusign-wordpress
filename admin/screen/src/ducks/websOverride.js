import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API

// REDUCER MOUNT POINT
const reducerMountPoint = 'websOverride';
// ACTIONS
export const FETCH_WEBS_OVERRIDE_SUCCESS = `${ACTION_PREFIX}FETCH_WEBS_OVERRIDE_SUCCESS`;
// SCHEMA
const webOverrideSchema = new Schema('websOverride');
const websOverrideSchema = arrayOf(webOverrideSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_WEBS_OVERRIDE_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.websOverride,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_WEBS_OVERRIDE_SUCCESS:
      return action.response.result;
    default:
      return state;
  }
};
export default combineReducers({
  byId,
  ids,
});
// ACCESSORS AKA SELECTORS
const getWebsOverrideIds = state => state[reducerMountPoint].ids;
const getWebsOverrideById = state => state[reducerMountPoint].byId;
export const getWebsOverride = createSelector(
  [getWebsOverrideIds, getWebsOverrideById],
  (websOverrideIds, websOverrideById) => websOverrideIds.map(id => websOverrideById[id])
);
export const setWebsOverride = response => ({
  type: FETCH_WEBS_OVERRIDE_SUCCESS,
  response: normalize(response, websOverrideSchema),
});
