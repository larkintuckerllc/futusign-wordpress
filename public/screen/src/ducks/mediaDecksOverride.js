import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
import { ServerException } from '../util/exceptions';
// API
import { get } from '../apis/mediaDecks';

// REDUCER MOUNT POINT
const reducerMountPoint = 'mediaDecksOverride';
// ACTIONS
export const FETCH_MEDIA_DECKS_OVERRIDE_REQUEST
  = `${ACTION_PREFIX}FETCH_MEDIA_DECKS_OVERRIDE_REQUEST`;
export const FETCH_MEDIA_DECKS_OVERRIDE_SUCCESS
  = `${ACTION_PREFIX}FETCH_MEDIA_DECKS_OVERRIDE_SUCCESS`;
export const FETCH_MEDIA_DECKS_OVERRIDE_ERROR = `${ACTION_PREFIX}FETCH_MEDIA_DECKS_OVERRIDE_ERROR`;
export const RESET_FETCH_MEDIA_DECKS_OVERRIDE_ERROR
  = `${ACTION_PREFIX}RESET_FETCH_MEDIA_DECKS_OVERRIDE_ERROR`;
export const RESET_MEDIA_DECKS_OVERRIDE = `${ACTION_PREFIX}RESET_MEDIA_DECKS_OVERRIDE`;
// SCHEMA
const mediaDeckSchema = new Schema('mediaDecks');
const mediaDecksOverrideSchema = arrayOf(mediaDeckSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_MEDIA_DECKS_OVERRIDE_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.mediaDecks,
      };
    }
    case RESET_MEDIA_DECKS_OVERRIDE: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_MEDIA_DECKS_OVERRIDE_SUCCESS:
      return action.response.result;
    case RESET_MEDIA_DECKS_OVERRIDE:
      return [];
    default:
      return state;
  }
};
const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_MEDIA_DECKS_OVERRIDE_REQUEST:
      return true;
    case FETCH_MEDIA_DECKS_OVERRIDE_SUCCESS:
    case FETCH_MEDIA_DECKS_OVERRIDE_ERROR:
      return false;
    default:
      return state;
  }
};
const fetchErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_MEDIA_DECKS_OVERRIDE_ERROR:
      return action.message;
    case FETCH_MEDIA_DECKS_OVERRIDE_REQUEST:
    case FETCH_MEDIA_DECKS_OVERRIDE_SUCCESS:
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
export const getMediaDeck = (state, id) => state[reducerMountPoint].byId[id];
const getMediaDecksOverrideIds = state => state[reducerMountPoint].ids;
const getMediaDecksOverrideById = state => state[reducerMountPoint].byId;
export const getMediaDecksOverride = createSelector(
  [getMediaDecksOverrideIds, getMediaDecksOverrideById],
  (mediaDecksOverrideIds, mediaDecksOverrideById) => mediaDecksOverrideIds
    .map(id => mediaDecksOverrideById[id])
);
export const getIsFetchingMediaDecksOverride = (state) => state[reducerMountPoint].isFetching;
export const getFetchMediaDecksOverrideErrorMessage = (state) => state[reducerMountPoint]
  .fetchErrorMessage;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchMediaDecksOverride = (overrideIds) => (dispatch, getState) => {
  if (!Array.isArray(overrideIds)) throw new Error();
  if (getIsFetchingMediaDecksOverride(getState())) throw new Error();
  dispatch({
    type: FETCH_MEDIA_DECKS_OVERRIDE_REQUEST,
  });
  return get(overrideIds, true)
    .then(
      response => dispatch({
        type: FETCH_MEDIA_DECKS_OVERRIDE_SUCCESS,
        response: normalize(response, mediaDecksOverrideSchema),
      }),
      error => {
        dispatch({
          type: FETCH_MEDIA_DECKS_OVERRIDE_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchMediaDecksOverrideError = () => ({
  type: RESET_FETCH_MEDIA_DECKS_OVERRIDE_ERROR,
});
export const resetMediaDecksOverride = () => ({
  type: RESET_MEDIA_DECKS_OVERRIDE,
});
