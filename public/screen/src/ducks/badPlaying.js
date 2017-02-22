import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'badPlaying';
// ACTIONS
export const SET_BAD_PLAYING = `${ACTION_PREFIX}SET_BAD_PLAYING`;
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_BAD_PLAYING:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getBadPlaying = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validBadPlaying = value =>
  !(value === undefined || typeof value !== 'boolean');
// ACTION CREATORS
export const setBadPlaying = (value) => {
  if (!validBadPlaying(value)) throw new Error();
  return ({
    type: SET_BAD_PLAYING,
    value,
  });
};
