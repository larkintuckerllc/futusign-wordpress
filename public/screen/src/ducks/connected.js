import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'connected';
// ACTIONS
export const SET_CONNECTED = `${ACTION_PREFIX}SET_CONNECTED`;
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_CONNECTED:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getConnected = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validConnected = value =>
  !(value === undefined || typeof value !== 'boolean');
// ACTION CREATORS
export const setConnected = (value) => {
  if (!validConnected(value)) throw new Error();
  return ({
    type: SET_CONNECTED,
    value,
  });
};
