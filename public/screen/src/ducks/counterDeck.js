import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'counterDeck';
// ACTIONS
export const SET_COUNTER_DECK = `${ACTION_PREFIX}SET_COUNTER_DECK`;
// SCHEMA
// REDUCERS
export default (state = 0, action) => {
  switch (action.type) {
    case SET_COUNTER_DECK:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getCounterDeck = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validCounterDeck = value =>
  !(value === undefined || typeof value !== 'number');
// ACTION CREATORS
export const setCounterDeck = (value) => {
  if (!validCounterDeck(value)) throw new Error();
  return ({
    type: SET_COUNTER_DECK,
    value,
  });
};
