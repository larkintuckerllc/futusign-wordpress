import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'currentlyIsPlaying';
// ACTIONS
export const SET_CURRENTLY_IS_PLAYING = `${ACTION_PREFIX}SET_CURRENTLY_IS_PLAYING`;
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_CURRENTLY_IS_PLAYING:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getCurrentlyIsPlaying = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validCurrentlyIsPlaying = value =>
  !(value === undefined || typeof value !== 'boolean');
// ACTION CREATORS
export const setCurrentlyIsPlaying = (value) => {
  if (!validCurrentlyIsPlaying(value)) throw new Error();
  return ({
    type: SET_CURRENTLY_IS_PLAYING,
    value,
  });
};
