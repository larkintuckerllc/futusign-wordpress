import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
import { ServerException } from '../util/exceptions';
// API
import { get } from '../apis/slideDecks';

// REDUCER MOUNT POINT
const reducerMountPoint = 'slideDecks';
// ACTIONS
export const FETCH_SLIDE_DECKS_REQUEST = `${ACTION_PREFIX}FETCH_SLIDE_DECKS_REQUEST`;
export const FETCH_SLIDE_DECKS_SUCCESS = `${ACTION_PREFIX}FETCH_SLIDE_DECKS_SUCCESS`;
export const FETCH_SLIDE_DECKS_ERROR = `${ACTION_PREFIX}FETCH_SLIDE_DECKS_ERROR`;
export const RESET_FETCH_SLIDE_DECKS_ERROR = `${ACTION_PREFIX}RESET_FETCH_SLIDE_DECKS_ERROR`;
export const RESET_SLIDE_DECKS = `${ACTION_PREFIX}RESET_SLIDE_DECKS`;
// SCHEMA
const slideDeckSchema = new Schema('slideDecks');
const slideDecksSchema = arrayOf(slideDeckSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SLIDE_DECKS_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.slideDecks,
      };
    }
    case RESET_SLIDE_DECKS: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_SLIDE_DECKS_SUCCESS:
      return action.response.result;
    case RESET_SLIDE_DECKS:
      return [];
    default:
      return state;
  }
};
const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_SLIDE_DECKS_REQUEST:
      return true;
    case FETCH_SLIDE_DECKS_SUCCESS:
    case FETCH_SLIDE_DECKS_ERROR:
      return false;
    default:
      return state;
  }
};
const fetchErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_SLIDE_DECKS_ERROR:
      return action.message;
    case FETCH_SLIDE_DECKS_REQUEST:
    case FETCH_SLIDE_DECKS_SUCCESS:
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
const getSlideDecksIds = state => state[reducerMountPoint].ids;
const getSlideDecksById = state => state[reducerMountPoint].byId;
export const getSlideDecks = createSelector(
  [getSlideDecksIds, getSlideDecksById],
  (slideDecksIds, slideDecksById) => slideDecksIds.map(id => slideDecksById[id])
);
export const getIsFetchingSlideDecks = (state) => state[reducerMountPoint].isFetching;
export const getFetchSlideDecksErrorMessage = (state) => state[reducerMountPoint].fetchErrorMessage;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchSlideDecks = (playlistIds) => (dispatch, getState) => {
  if (!Array.isArray(playlistIds)) throw new Error();
  if (getIsFetchingSlideDecks(getState())) throw new Error();
  dispatch({
    type: FETCH_SLIDE_DECKS_REQUEST,
  });
  return get(playlistIds)
    .then(
      response => dispatch({
        type: FETCH_SLIDE_DECKS_SUCCESS,
        response: normalize(response, slideDecksSchema),
      }),
      error => {
        dispatch({
          type: FETCH_SLIDE_DECKS_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchSlideDecksError = () => ({
  type: RESET_FETCH_SLIDE_DECKS_ERROR,
});
export const resetSlideDecks = () => ({
  type: RESET_SLIDE_DECKS,
});
