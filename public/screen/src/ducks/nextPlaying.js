import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'nextPlaying';
// ACTIONS
export const SET_NEXT_PLAYING = `${ACTION_PREFIX}SET_NEXT_PLAYING`;
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_NEXT_PLAYING:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getNextPlaying = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validNextPlaying = value =>
  !(value === undefined || typeof value !== 'string');
// ACTION CREATORS
export const setNextPlaying = (value) => {
  if (!validNextPlaying(value)) throw new Error();
  return ({
    type: SET_NEXT_PLAYING,
    value,
  });
};
export const resetNextPlaying = () => ({
  type: SET_NEXT_PLAYING,
  value: null,
});
