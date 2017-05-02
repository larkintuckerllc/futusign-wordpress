import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'minSlideDeckPriority';
// ACTIONS
export const SET_MIN_SLIDE_DECK_PRIORITY = `${ACTION_PREFIX}SET_MIN_SLIDE_DECK_PRIORITY`;
// SCHEMA
// REDUCERS
export default (state = Infinity, action) => {
  switch (action.type) {
    case SET_MIN_SLIDE_DECK_PRIORITY:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getMinSlideDeckPriority = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validMinSlideDeckPriority = value =>
  !(value === undefined || typeof value !== 'number');
// ACTION CREATORS
export const setMinSlideDeckPriority = (value) => {
  if (!validMinSlideDeckPriority(value)) throw new Error();
  return ({
    type: SET_MIN_SLIDE_DECK_PRIORITY,
    value,
  });
};
