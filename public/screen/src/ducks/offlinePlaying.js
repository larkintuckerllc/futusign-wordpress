import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'offlinePlaying';
// ACTIONS
export const SET_OFFLINE_PLAYING = `${ACTION_PREFIX}SET_OFFLINE_PLAYING`;
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_OFFLINE_PLAYING:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getOfflinePlaying = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validOfflinePlaying = value =>
  !(value === undefined || typeof value !== 'boolean');
// ACTION CREATORS
export const setOfflinePlaying = (value) => {
  if (!validOfflinePlaying(value)) throw new Error();
  return ({
    type: SET_OFFLINE_PLAYING,
    value,
  });
};
