import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
import { ServerException } from '../util/exceptions';
// API
import { get } from '../apis/images';

// REDUCER MOUNT POINT
const reducerMountPoint = 'imagesOverride';
// ACTIONS
export const FETCH_IMAGES_OVERRIDE_REQUEST
  = `${ACTION_PREFIX}FETCH_IMAGES_OVERRIDE_REQUEST`;
export const FETCH_IMAGES_OVERRIDE_SUCCESS
  = `${ACTION_PREFIX}FETCH_IMAGES_OVERRIDE_SUCCESS`;
export const FETCH_IMAGES_OVERRIDE_ERROR = `${ACTION_PREFIX}FETCH_IMAGES_OVERRIDE_ERROR`;
export const RESET_FETCH_IMAGES_OVERRIDE_ERROR
  = `${ACTION_PREFIX}RESET_FETCH_IMAGES_OVERRIDE_ERROR`;
export const RESET_IMAGES_OVERRIDE = `${ACTION_PREFIX}RESET_IMAGES_OVERRIDE`;
// SCHEMA
const imageSchema = new Schema('images');
const imagesOverrideSchema = arrayOf(imageSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_IMAGES_OVERRIDE_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.images,
      };
    }
    case RESET_IMAGES_OVERRIDE: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_IMAGES_OVERRIDE_SUCCESS:
      return action.response.result;
    case RESET_IMAGES_OVERRIDE:
      return [];
    default:
      return state;
  }
};
const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_IMAGES_OVERRIDE_REQUEST:
      return true;
    case FETCH_IMAGES_OVERRIDE_SUCCESS:
    case FETCH_IMAGES_OVERRIDE_ERROR:
      return false;
    default:
      return state;
  }
};
const fetchErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_IMAGES_OVERRIDE_ERROR:
      return action.message;
    case FETCH_IMAGES_OVERRIDE_REQUEST:
    case FETCH_IMAGES_OVERRIDE_SUCCESS:
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
export const getImage = (state, id) => state[reducerMountPoint].byId[id];
const getImagesOverrideIds = state => state[reducerMountPoint].ids;
const getImagesOverrideById = state => state[reducerMountPoint].byId;
export const getImagesOverride = createSelector(
  [getImagesOverrideIds, getImagesOverrideById],
  (imagesOverrideIds, imagesOverrideById) => imagesOverrideIds
    .map(id => imagesOverrideById[id])
);
export const getIsFetchingImagesOverride = (state) => state[reducerMountPoint].isFetching;
export const getFetchImagesOverrideErrorMessage = (state) => state[reducerMountPoint]
  .fetchErrorMessage;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchImagesOverride = (overrideIds) => (dispatch, getState) => {
  if (!Array.isArray(overrideIds)) throw new Error();
  if (getIsFetchingImagesOverride(getState())) throw new Error();
  dispatch({
    type: FETCH_IMAGES_OVERRIDE_REQUEST,
  });
  return get(overrideIds, true)
    .then(
      response => dispatch({
        type: FETCH_IMAGES_OVERRIDE_SUCCESS,
        response: normalize(response, imagesOverrideSchema),
      }),
      error => {
        dispatch({
          type: FETCH_IMAGES_OVERRIDE_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchImagesOverrideError = () => ({
  type: RESET_FETCH_IMAGES_OVERRIDE_ERROR,
});
export const resetImagesOverride = () => ({
  type: RESET_IMAGES_OVERRIDE,
});
