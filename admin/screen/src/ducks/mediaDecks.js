import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API

// REDUCER MOUNT POINT
const reducerMountPoint = 'mediaDecks';
// ACTIONS
export const FETCH_MEDIA_DECKS_SUCCESS = `${ACTION_PREFIX}FETCH_MEDIA_DECKS_SUCCESS`;
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
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_MEDIA_DECKS_SUCCESS:
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
const getMediaDecksIds = state => state[reducerMountPoint].ids;
const getMediaDecksById = state => state[reducerMountPoint].byId;
export const getMediaDecks = createSelector(
  [getMediaDecksIds, getMediaDecksById],
  (mediaDecksIds, mediaDecksById) => mediaDecksIds.map(id => mediaDecksById[id])
);
export const setMediaDecks = response => ({
  type: FETCH_MEDIA_DECKS_SUCCESS,
  response: normalize(response, mediaDecksSchema),
});
