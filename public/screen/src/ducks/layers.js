import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API
import { get } from '../apis/layers';

// REDUCER MOUNT POINT
const reducerMountPoint = 'layers';
// ACTIONS
export const FETCH_LAYERS_REQUEST = `${ACTION_PREFIX}FETCH_LAYERS_REQUEST`;
export const FETCH_LAYERS_SUCCESS = `${ACTION_PREFIX}FETCH_LAYERS_SUCCESS`;
export const RESET_LAYERS = `${ACTION_PREFIX}RESET_LAYERS`;
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
    case RESET_LAYERS: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_LAYERS_SUCCESS:
      return action.response.result;
    case RESET_LAYERS:
      return [];
    default:
      return state;
  }
};
const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_LAYERS_REQUEST:
      return true;
    case FETCH_LAYERS_SUCCESS:
      return false;
    default:
      return state;
  }
};
export default combineReducers({
  byId,
  ids,
  isFetching,
});
// ACCESSORS AKA SELECTORS
export const getSlideDeck = (state, id) => state[reducerMountPoint].byId[id];
const getLayersIds = state => state[reducerMountPoint].ids;
const getLayersById = state => state[reducerMountPoint].byId;
export const getLayers = createSelector(
  [getLayersIds, getLayersById],
  (layersIds, layersById) => layersIds.map(id => layersById[id])
);
export const getIsFetchingLayers = (state) => state[reducerMountPoint].isFetching;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchLayers = (playlistIds) => (dispatch, getState) => {
  if (!Array.isArray(playlistIds)) throw new Error();
  if (getIsFetchingLayers(getState())) throw new Error();
  dispatch({
    type: FETCH_LAYERS_REQUEST,
  });
  return get(playlistIds)
    .then(
      response => dispatch({
        type: FETCH_LAYERS_SUCCESS,
        response: normalize(response, layersSchema),
      })
    );
};
export const resetLayers = () => ({
  type: RESET_LAYERS,
});
