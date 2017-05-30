import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API

// REDUCER MOUNT POINT
const reducerMountPoint = 'layers';
// ACTIONS
export const FETCH_LAYERS_SUCCESS = `${ACTION_PREFIX}FETCH_LAYERS_SUCCESS`;
// SCHEMA
const layerSchema = new Schema('layers');
const layersSchema = arrayOf(layerSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_LAYERS_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.layers,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_LAYERS_SUCCESS:
      return action.response.result;
    default:
      return state;
  }
};
export default combineReducers({
  byId,
  ids,
});
// ACCESSORS AKA SELECTORS
const getLayersIds = state => state[reducerMountPoint].ids;
const getLayersById = state => state[reducerMountPoint].byId;
export const getLayers = createSelector(
  [getLayersIds, getLayersById],
  (layersIds, layersById) => layersIds.map(id => layersById[id])
);
export const setLayers = response => ({
  type: FETCH_LAYERS_SUCCESS,
  response: normalize(response, layersSchema),
});
