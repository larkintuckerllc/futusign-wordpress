import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API

// REDUCER MOUNT POINT
const reducerMountPoint = 'mediaDecksOverride';
// ACTIONS
export const FETCH_MEDIA_DECKS_OVERRIDE_SUCCESS =
  `${ACTION_PREFIX}FETCH_MEDIA_DECKS_OVERRIDE_SUCCESS`;
// SCHEMA
const mediaDeckOverrideSchema = new Schema('mediaDecksOverride');
const mediaDecksOverrideSchema = arrayOf(mediaDeckOverrideSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_MEDIA_DECKS_OVERRIDE_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.mediaDecksOverride,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_MEDIA_DECKS_OVERRIDE_SUCCESS:
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
const getMediaDecksOverrideIds = state => state[reducerMountPoint].ids;
const getMediaDecksOverrideById = state => state[reducerMountPoint].byId;
export const getMediaDecksOverride = createSelector(
  [getMediaDecksOverrideIds, getMediaDecksOverrideById],
  (mediaDecksOverrideIds, mediaDecksOverrideById) => mediaDecksOverrideIds
    .map(id => mediaDecksOverrideById[id])
);
export const setMediaDecksOverride = response => ({
  type: FETCH_MEDIA_DECKS_OVERRIDE_SUCCESS,
  response: normalize(response, mediaDecksOverrideSchema),
});
