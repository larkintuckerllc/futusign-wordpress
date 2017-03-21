import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
import { ServerException } from '../util/exceptions';
// API
import { get } from '../apis/images';

// TODO: CONSIDER RID OF ERROR
// REDUCER MOUNT POINT
const reducerMountPoint = 'images';
// ACTIONS
export const FETCH_IMAGES_REQUEST = `${ACTION_PREFIX}FETCH_IMAGES_REQUEST`;
export const FETCH_IMAGES_SUCCESS = `${ACTION_PREFIX}FETCH_IMAGES_SUCCESS`;
export const FETCH_IMAGES_ERROR = `${ACTION_PREFIX}FETCH_IMAGES_ERROR`;
export const RESET_FETCH_IMAGES_ERROR = `${ACTION_PREFIX}RESET_FETCH_IMAGES_ERROR`;
export const RESET_IMAGES = `${ACTION_PREFIX}RESET_IMAGES`;
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
    case RESET_IMAGES: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_IMAGES_SUCCESS:
      return action.response.result;
    case RESET_IMAGES:
      return [];
    default:
      return state;
  }
};
const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_IMAGES_REQUEST:
      return true;
    case FETCH_IMAGES_SUCCESS:
    case FETCH_IMAGES_ERROR:
      return false;
    default:
      return state;
  }
};
const fetchErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_IMAGES_ERROR:
      return action.message;
    case FETCH_IMAGES_REQUEST:
    case FETCH_IMAGES_SUCCESS:
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
const getImagesIds = state => state[reducerMountPoint].ids;
const getImagesById = state => state[reducerMountPoint].byId;
export const getImages = createSelector(
  [getImagesIds, getImagesById],
  (imagesIds, imagesById) => imagesIds.map(id => imagesById[id])
);
export const getIsFetchingImages = (state) => state[reducerMountPoint].isFetching;
export const getFetchImagesErrorMessage
  = (state) => state[reducerMountPoint].fetchErrorMessage;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchImages = (playlistIds) => (dispatch, getState) => {
  if (!Array.isArray(playlistIds)) throw new Error();
  if (getIsFetchingImages(getState())) throw new Error();
  dispatch({
    type: FETCH_IMAGES_REQUEST,
  });
  return get(playlistIds)
    .then(
      response => dispatch({
        type: FETCH_IMAGES_SUCCESS,
        response: normalize(response, imagesSchema),
      }),
      error => {
        dispatch({
          type: FETCH_IMAGES_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchImagesError = () => ({
  type: RESET_FETCH_IMAGES_ERROR,
});
export const resetImages = () => ({
  type: RESET_IMAGES,
});
