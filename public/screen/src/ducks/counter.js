import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'counter';
// ACTIONS
export const SET_COUNTER = `${ACTION_PREFIX}SET_COUNTER`;
// SCHEMA
// REDUCERS
export default (state = 0, action) => {
  switch (action.type) {
    case SET_COUNTER:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getCounter = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validCounter = value =>
  !(value === undefined || typeof value !== 'number');
// ACTION CREATORS
export const setCounter = (value) => {
  if (!validCounter(value)) throw new Error();
  return ({
    type: SET_COUNTER,
    value,
  });
};
