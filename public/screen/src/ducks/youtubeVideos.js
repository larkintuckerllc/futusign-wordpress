import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API
import { get } from '../apis/youtubeVideos';

// REDUCER MOUNT POINT
const reducerMountPoint = 'youtubeVideos';
// ACTIONS
export const FETCH_YOUTUBE_VIDEOS_REQUEST = `${ACTION_PREFIX}FETCH_YOUTUBE_VIDEOS_REQUEST`;
export const FETCH_YOUTUBE_VIDEOS_SUCCESS = `${ACTION_PREFIX}FETCH_YOUTUBE_VIDEOS_SUCCESS`;
export const RESET_YOUTUBE_VIDEOS = `${ACTION_PREFIX}RESET_YOUTUBE_VIDEOS`;
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
    case RESET_YOUTUBE_VIDEOS: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_YOUTUBE_VIDEOS_SUCCESS:
      return action.response.result;
    case RESET_YOUTUBE_VIDEOS:
      return [];
    default:
      return state;
  }
};
const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_YOUTUBE_VIDEOS_REQUEST:
      return true;
    case FETCH_YOUTUBE_VIDEOS_SUCCESS:
      return false;
    default:
      return state;
  }
};
export default combineReducers({
  byId,
  ids,
  isFetching,
});
// ACCESSORS AKA SELECTORS
export const getSlideDeck = (state, id) => state[reducerMountPoint].byId[id];
const getYoutubeVideosIds = state => state[reducerMountPoint].ids;
const getYoutubeVideosById = state => state[reducerMountPoint].byId;
export const getYoutubeVideos = createSelector(
  [getYoutubeVideosIds, getYoutubeVideosById],
  (youtubeVideosIds, youtubeVideosById) => youtubeVideosIds.map(id => youtubeVideosById[id])
);
export const getIsFetchingYoutubeVideos = (state) => state[reducerMountPoint].isFetching;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchYoutubeVideos = (playlistIds) => (dispatch, getState) => {
  if (!Array.isArray(playlistIds)) throw new Error();
  if (getIsFetchingYoutubeVideos(getState())) throw new Error();
  dispatch({
    type: FETCH_YOUTUBE_VIDEOS_REQUEST,
  });
  return get(playlistIds)
    .then(
      response => dispatch({
        type: FETCH_YOUTUBE_VIDEOS_SUCCESS,
        response: normalize(response, youtubeVideosSchema),
      })
    );
};
export const resetYoutubeVideos = () => ({
  type: RESET_YOUTUBE_VIDEOS,
});
