import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'time';
// ACTIONS
export const SET_TIME = `${ACTION_PREFIX}SET_TIME`;
// SCHEMA
// REDUCERS
export default (state = 0, action) => {
  switch (action.type) {
    case SET_TIME:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getTime = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validTime = value =>
  !(value === undefined || typeof value !== 'number');
// ACTION CREATORS
export const setTime = (value) => {
  if (!validTime(value)) throw new Error();
  return ({
    type: SET_TIME,
    value,
  });
};
