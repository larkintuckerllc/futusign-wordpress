import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'override';
// ACTIONS
export const SET_OVERRIDE = `${ACTION_PREFIX}SET_OVERRIDE`;
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_OVERRIDE:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getOverride = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validOverride = value =>
  !(value === undefined || typeof value !== 'boolean');
// ACTION CREATORS
export const setOverride = (value) => {
  if (!validOverride(value)) throw new Error();
  return ({
    type: SET_OVERRIDE,
    value,
  });
};
