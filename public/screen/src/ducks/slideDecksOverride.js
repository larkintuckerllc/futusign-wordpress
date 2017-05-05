import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
import { ServerException } from '../util/exceptions';
// API
import { get } from '../apis/slideDecks';

// REDUCER MOUNT POINT
const reducerMountPoint = 'slideDecksOverride';
// ACTIONS
export const FETCH_SLIDE_DECKS_OVERRIDE_REQUEST
  = `${ACTION_PREFIX}FETCH_SLIDE_DECKS_OVERRIDE_REQUEST`;
export const FETCH_SLIDE_DECKS_OVERRIDE_SUCCESS
  = `${ACTION_PREFIX}FETCH_SLIDE_DECKS_OVERRIDE_SUCCESS`;
export const FETCH_SLIDE_DECKS_OVERRIDE_ERROR = `${ACTION_PREFIX}FETCH_SLIDE_DECKS_OVERRIDE_ERROR`;
export const RESET_FETCH_SLIDE_DECKS_OVERRIDE_ERROR
  = `${ACTION_PREFIX}RESET_FETCH_SLIDE_DECKS_OVERRIDE_ERROR`;
export const RESET_SLIDE_DECKS_OVERRIDE = `${ACTION_PREFIX}RESET_SLIDE_DECKS_OVERRIDE`;
// SCHEMA
const slideDeckSchema = new Schema('slideDecks');
const slideDecksOverrideSchema = arrayOf(slideDeckSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SLIDE_DECKS_OVERRIDE_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.slideDecks,
      };
    }
    case RESET_SLIDE_DECKS_OVERRIDE: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_SLIDE_DECKS_OVERRIDE_SUCCESS:
      return action.response.result;
    case RESET_SLIDE_DECKS_OVERRIDE:
      return [];
    default:
      return state;
  }
};
const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_SLIDE_DECKS_OVERRIDE_REQUEST:
      return true;
    case FETCH_SLIDE_DECKS_OVERRIDE_SUCCESS:
    case FETCH_SLIDE_DECKS_OVERRIDE_ERROR:
      return false;
    default:
      return state;
  }
};
const fetchErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_SLIDE_DECKS_OVERRIDE_ERROR:
      return action.message;
    case FETCH_SLIDE_DECKS_OVERRIDE_REQUEST:
    case FETCH_SLIDE_DECKS_OVERRIDE_SUCCESS:
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
const getSlideDecksOverrideIds = state => state[reducerMountPoint].ids;
const getSlideDecksOverrideById = state => state[reducerMountPoint].byId;
export const getSlideDecksOverride = createSelector(
  [getSlideDecksOverrideIds, getSlideDecksOverrideById],
  (slideDecksOverrideIds, slideDecksOverrideById) => slideDecksOverrideIds
    .map(id => slideDecksOverrideById[id])
);
export const getIsFetchingSlideDecksOverride = (state) => state[reducerMountPoint].isFetching;
export const getFetchSlideDecksOverrideErrorMessage = (state) => state[reducerMountPoint]
  .fetchErrorMessage;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchSlideDecksOverride = (overrideIds) => (dispatch, getState) => {
  if (!Array.isArray(overrideIds)) throw new Error();
  if (getIsFetchingSlideDecksOverride(getState())) throw new Error();
  dispatch({
    type: FETCH_SLIDE_DECKS_OVERRIDE_REQUEST,
  });
  return get(overrideIds, true)
    .then(
      response => dispatch({
        type: FETCH_SLIDE_DECKS_OVERRIDE_SUCCESS,
        response: normalize(response, slideDecksOverrideSchema),
      }),
      error => {
        dispatch({
          type: FETCH_SLIDE_DECKS_OVERRIDE_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchSlideDecksOverrideError = () => ({
  type: RESET_FETCH_SLIDE_DECKS_OVERRIDE_ERROR,
});
export const resetSlideDecksOverride = () => ({
  type: RESET_SLIDE_DECKS_OVERRIDE,
});
