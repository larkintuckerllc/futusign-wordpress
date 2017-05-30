import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API

// REDUCER MOUNT POINT
const reducerMountPoint = 'youtubeVideos';
// ACTIONS
export const FETCH_YOUTUBE_VIDEOS_SUCCESS = `${ACTION_PREFIX}FETCH_YOUTUBE_VIDEOS_SUCCESS`;
// SCHEMA
const youtubeVideoSchema = new Schema('youtubeVideos');
const youtubeVideosSchema = arrayOf(youtubeVideoSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_YOUTUBE_VIDEOS_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.youtubeVideos,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_YOUTUBE_VIDEOS_SUCCESS:
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
const getYoutubeVideosIds = state => state[reducerMountPoint].ids;
const getYoutubeVideosById = state => state[reducerMountPoint].byId;
export const getYoutubeVideos = createSelector(
  [getYoutubeVideosIds, getYoutubeVideosById],
  (youtubeVideosIds, youtubeVideosById) => youtubeVideosIds.map(id => youtubeVideosById[id])
);
export const setYoutubeVideos = response => ({
  type: FETCH_YOUTUBE_VIDEOS_SUCCESS,
  response: normalize(response, youtubeVideosSchema),
});
