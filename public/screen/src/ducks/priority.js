import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'priority';
// ACTIONS
export const SET_PRIORITY = `${ACTION_PREFIX}SET_PRIORITY`;
// SCHEMA
// REDUCERS
export default (state = 1, action) => {
  switch (action.type) {
    case SET_PRIORITY:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getPriority = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validPriority = value =>
  !(value === undefined || typeof value !== 'number');
// ACTION CREATORS
export const setPriority = (value) => {
  if (!validPriority(value)) throw new Error();
  return ({
    type: SET_PRIORITY,
    value,
  });
};
