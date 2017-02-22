import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'appBlocking';
// ACTIONS
export const SET_APP_BLOCKING = `${ACTION_PREFIX}SET_APP_BLOCKING`;
// SCHEMA
// REDUCERS
export default (state = true, action) => {
  switch (action.type) {
    case SET_APP_BLOCKING:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getAppBlocking = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validAppBlocking = value =>
  !(value === undefined || typeof value !== 'boolean');
// ACTION CREATORS
export const setAppBlocking = (value) => {
  if (!validAppBlocking(value)) throw new Error();
  return ({
    type: SET_APP_BLOCKING,
    value,
  });
};
