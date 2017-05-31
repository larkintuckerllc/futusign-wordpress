import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API

// REDUCER MOUNT POINT
const reducerMountPoint = 'youtubeVideosOverride';
// ACTIONS
export const FETCH_YOUTUBE_VIDEOS_OVERRIDE_SUCCESS =
  `${ACTION_PREFIX}FETCH_YOUTUBE_VIDEOS_OVERRIDE_SUCCESS`;
// SCHEMA
const youtubeVideoOverrideSchema = new Schema('youtubeVideosOverride');
const youtubeVideosOverrideSchema = arrayOf(youtubeVideoOverrideSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_YOUTUBE_VIDEOS_OVERRIDE_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.youtubeVideosOverride,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_YOUTUBE_VIDEOS_OVERRIDE_SUCCESS:
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
const getYoutubeVideosOverrideIds = state => state[reducerMountPoint].ids;
const getYoutubeVideosOverrideById = state => state[reducerMountPoint].byId;
export const getYoutubeVideosOverride = createSelector(
  [getYoutubeVideosOverrideIds, getYoutubeVideosOverrideById],
  (youtubeVideosOverrideIds, youtubeVideosOverrideById) => youtubeVideosOverrideIds
    .map(id => youtubeVideosOverrideById[id])
);
export const setYoutubeVideosOverride = response => ({
  type: FETCH_YOUTUBE_VIDEOS_OVERRIDE_SUCCESS,
  response: normalize(response, youtubeVideosOverrideSchema),
});
