import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'layerBlocking';
// ACTIONS
export const SET_LAYER_BLOCKING = `${ACTION_PREFIX}SET_LAYER_BLOCKING`;
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_LAYER_BLOCKING:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getLayerBlocking = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validLayerBlocking = value =>
  !(value === undefined || typeof value !== 'boolean');
// ACTION CREATORS
export const setLayerBlocking = (value) => {
  if (!validLayerBlocking(value)) throw new Error();
  return ({
    type: SET_LAYER_BLOCKING,
    value,
  });
};
