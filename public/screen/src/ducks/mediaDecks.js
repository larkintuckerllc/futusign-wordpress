import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
import { ServerException } from '../util/exceptions';
// API
import { get } from '../apis/mediaDecks';

// REDUCER MOUNT POINT
const reducerMountPoint = 'mediaDecks';
// ACTIONS
export const FETCH_MEDIA_DECKS_REQUEST = `${ACTION_PREFIX}FETCH_MEDIA_DECKS_REQUEST`;
export const FETCH_MEDIA_DECKS_SUCCESS = `${ACTION_PREFIX}FETCH_MEDIA_DECKS_SUCCESS`;
export const FETCH_MEDIA_DECKS_ERROR = `${ACTION_PREFIX}FETCH_MEDIA_DECKS_ERROR`;
export const RESET_FETCH_MEDIA_DECKS_ERROR = `${ACTION_PREFIX}RESET_FETCH_MEDIA_DECKS_ERROR`;
export const RESET_MEDIA_DECKS = `${ACTION_PREFIX}RESET_MEDIA_DECKS`;
// SCHEMA
const mediaDeckSchema = new Schema('mediaDecks');
const mediaDecksSchema = arrayOf(mediaDeckSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_MEDIA_DECKS_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.mediaDecks,
      };
    }
    case RESET_MEDIA_DECKS: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_MEDIA_DECKS_SUCCESS:
      return action.response.result;
    case RESET_MEDIA_DECKS:
      return [];
    default:
      return state;
  }
};
const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_MEDIA_DECKS_REQUEST:
      return true;
    case FETCH_MEDIA_DECKS_SUCCESS:
    case FETCH_MEDIA_DECKS_ERROR:
      return false;
    default:
      return state;
  }
};
const fetchErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_MEDIA_DECKS_ERROR:
      return action.message;
    case FETCH_MEDIA_DECKS_REQUEST:
    case FETCH_MEDIA_DECKS_SUCCESS:
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
const getMediaDecksIds = state => state[reducerMountPoint].ids;
const getMediaDecksById = state => state[reducerMountPoint].byId;
export const getMediaDecks = createSelector(
  [getMediaDecksIds, getMediaDecksById],
  (mediaDecksIds, mediaDecksById) => mediaDecksIds.map(id => mediaDecksById[id])
);
export const getIsFetchingMediaDecks = (state) => state[reducerMountPoint].isFetching;
export const getFetchMediaDecksErrorMessage = (state) => state[reducerMountPoint].fetchErrorMessage;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchMediaDecks = (playlistIds) => (dispatch, getState) => {
  if (!Array.isArray(playlistIds)) throw new Error();
  if (getIsFetchingMediaDecks(getState())) throw new Error();
  dispatch({
    type: FETCH_MEDIA_DECKS_REQUEST,
  });
  return get(playlistIds)
    .then(
      response => dispatch({
        type: FETCH_MEDIA_DECKS_SUCCESS,
        response: normalize(response, mediaDecksSchema),
      }),
      error => {
        dispatch({
          type: FETCH_MEDIA_DECKS_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchMediaDecksError = () => ({
  type: RESET_FETCH_MEDIA_DECKS_ERROR,
});
export const resetMediaDecks = () => ({
  type: RESET_MEDIA_DECKS,
});
