import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API

// REDUCER MOUNT POINT
const reducerMountPoint = 'images';
// ACTIONS
export const FETCH_IMAGES_SUCCESS = `${ACTION_PREFIX}FETCH_IMAGES_SUCCESS`;
// SCHEMA
const imageSchema = new Schema('images');
const imagesSchema = arrayOf(imageSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_IMAGES_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.images,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_IMAGES_SUCCESS:
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
const getImagesIds = state => state[reducerMountPoint].ids;
const getImagesById = state => state[reducerMountPoint].byId;
export const getImages = createSelector(
  [getImagesIds, getImagesById],
  (imagesIds, imagesById) => imagesIds.map(id => imagesById[id])
);
export const setImages = response => ({
  type: FETCH_IMAGES_SUCCESS,
  response: normalize(response, imagesSchema),
});
