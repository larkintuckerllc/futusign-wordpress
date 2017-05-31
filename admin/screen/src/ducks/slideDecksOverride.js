import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API

// REDUCER MOUNT POINT
const reducerMountPoint = 'slideDecksOverride';
// ACTIONS
export const FETCH_SLIDE_DECKS_OVERRIDE_SUCCESS =
  `${ACTION_PREFIX}FETCH_SLIDE_DECKS_OVERRIDE_SUCCESS`;
// SCHEMA
const slideDeckOverrideSchema = new Schema('slideDecksOverride');
const slideDecksOverrideSchema = arrayOf(slideDeckOverrideSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SLIDE_DECKS_OVERRIDE_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.slideDecksOverride,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_SLIDE_DECKS_OVERRIDE_SUCCESS:
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
const getSlideDecksOverrideIds = state => state[reducerMountPoint].ids;
const getSlideDecksOverrideById = state => state[reducerMountPoint].byId;
export const getSlideDecksOverride = createSelector(
  [getSlideDecksOverrideIds, getSlideDecksOverrideById],
  (slideDecksOverrideIds, slideDecksOverrideById) => slideDecksOverrideIds
    .map(id => slideDecksOverrideById[id])
);
export const setSlideDecksOverride = response => ({
  type: FETCH_SLIDE_DECKS_OVERRIDE_SUCCESS,
  response: normalize(response, slideDecksOverrideSchema),
});
