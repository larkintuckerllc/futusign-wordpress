import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'currentlyPlaying';
// ACTIONS
export const SET_CURRENTLY_PLAYING = `${ACTION_PREFIX}SET_CURRENTLY_PLAYING`;
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_CURRENTLY_PLAYING:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getCurrentlyPlaying = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validCurrentlyPlaying = value =>
  !(value === undefined || typeof value !== 'string');
// ACTION CREATORS
export const setCurrentlyPlaying = (value) => {
  if (!validCurrentlyPlaying(value)) throw new Error();
  return ({
    type: SET_CURRENTLY_PLAYING,
    value,
  });
};
export const resetCurrentlyPlaying = () => ({
  type: SET_CURRENTLY_PLAYING,
  value: null,
});
