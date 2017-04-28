import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'nextIsReady';
// ACTIONS
export const SET_NEXT_IS_READY = `${ACTION_PREFIX}SET_NEXT_IS_READY`;
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_NEXT_IS_READY:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getNextIsReady = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validNextIsReady = value =>
  !(value === undefined || typeof value !== 'boolean');
// ACTION CREATORS
export const setNextIsReady = (value) => {
  if (!validNextIsReady(value)) throw new Error();
  return ({
    type: SET_NEXT_IS_READY,
    value,
  });
};
