import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API

// REDUCER MOUNT POINT
const reducerMountPoint = 'slideDecks';
// ACTIONS
export const FETCH_SLIDE_DECKS_SUCCESS = `${ACTION_PREFIX}FETCH_SLIDE_DECKS_SUCCESS`;
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
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_SLIDE_DECKS_SUCCESS:
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
const getSlideDecksIds = state => state[reducerMountPoint].ids;
const getSlideDecksById = state => state[reducerMountPoint].byId;
export const getSlideDecks = createSelector(
  [getSlideDecksIds, getSlideDecksById],
  (slideDecksIds, slideDecksById) => slideDecksIds.map(id => slideDecksById[id])
);
export const setSlideDecks = response => ({
  type: FETCH_SLIDE_DECKS_SUCCESS,
  response: normalize(response, slideDecksSchema),
});
