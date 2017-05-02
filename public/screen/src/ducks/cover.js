import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'cover';
// ACTIONS
export const SET_COVER = `${ACTION_PREFIX}SET_COVER`;
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_COVER:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getCover = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validCover = value =>
  !(value === undefined || typeof value !== 'boolean');
// ACTION CREATORS
export const setCover = (value) => {
  if (!validCover(value)) throw new Error();
  return ({
    type: SET_COVER,
    value,
  });
};
