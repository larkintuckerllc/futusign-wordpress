import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'version';
// ACTIONS
export const SET_VERSION = `${ACTION_PREFIX}SET_VERSION`;
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_VERSION:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getVersion = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validVersion = value =>
  !(value === undefined || typeof value !== 'string');
// ACTION CREATORS
export const setVersion = (value) => {
  if (!validVersion(value)) throw new Error();
  return ({
    type: SET_VERSION,
    value,
  });
};
