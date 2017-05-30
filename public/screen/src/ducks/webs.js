import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API

// REDUCER MOUNT POINT
const reducerMountPoint = 'webs';
// ACTIONS
export const FETCH_WEBS_SUCCESS = `${ACTION_PREFIX}FETCH_WEBS_SUCCESS`;
// SCHEMA
const webSchema = new Schema('webs');
const websSchema = arrayOf(webSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_WEBS_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.webs,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_WEBS_SUCCESS:
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
const getWebsIds = state => state[reducerMountPoint].ids;
const getWebsById = state => state[reducerMountPoint].byId;
export const getWebs = createSelector(
  [getWebsIds, getWebsById],
  (websIds, websById) => websIds.map(id => websById[id])
);
export const setWebs = response => ({
  type: FETCH_WEBS_SUCCESS,
  response: normalize(response, websSchema),
});
