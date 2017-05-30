import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API

// REDUCER MOUNT POINT
const reducerMountPoint = 'imagesOverride';
// ACTIONS
export const FETCH_IMAGES_OVERRIDE_SUCCESS = `${ACTION_PREFIX}FETCH_IMAGES_OVERRIDE_SUCCESS`;
// SCHEMA
const imageOverrideSchema = new Schema('imagesOverride');
const imagesOverrideSchema = arrayOf(imageOverrideSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_IMAGES_OVERRIDE_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.imagesOverride,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_IMAGES_OVERRIDE_SUCCESS:
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
const getImagesOverrideIds = state => state[reducerMountPoint].ids;
const getImagesOverrideById = state => state[reducerMountPoint].byId;
export const getImagesOverride = createSelector(
  [getImagesOverrideIds, getImagesOverrideById],
  (imagesOverrideIds, imagesOverrideById) => imagesOverrideIds.map(id => imagesOverrideById[id])
);
export const setImagesOverride = response => ({
  type: FETCH_IMAGES_OVERRIDE_SUCCESS,
  response: normalize(response, imagesOverrideSchema),
});
