import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'noPlayer';
// ACTIONS
export const SET_NO_PLAYER = `${ACTION_PREFIX}SET_NO_PLAYER`;
// SCHEMA
// REDUCERS
export default (state = true, action) => {
  switch (action.type) {
    case SET_NO_PLAYER:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getNoPlayer = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validNoPlayer = value =>
  !(value === undefined || typeof value !== 'boolean');
// ACTION CREATORS
export const setNoPlayer = (value) => {
  if (!validNoPlayer(value)) throw new Error();
  return ({
    type: SET_NO_PLAYER,
    value,
  });
};
