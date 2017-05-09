import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'minImagePriority';
// ACTIONS
export const SET_MIN_IMAGE_PRIORITY = `${ACTION_PREFIX}SET_MIN_IMAGE_PRIORITY`;
// SCHEMA
// REDUCERS
export default (state = Infinity, action) => {
  switch (action.type) {
    case SET_MIN_IMAGE_PRIORITY:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getMinImagePriority = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validMinImagePriority = value =>
  !(value === undefined || typeof value !== 'number');
// ACTION CREATORS
export const setMinImagePriority = (value) => {
  if (!validMinImagePriority(value)) throw new Error();
  return ({
    type: SET_MIN_IMAGE_PRIORITY,
    value,
  });
};
