import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
// API

// REDUCER MOUNT POINT
const reducerMountPoint = 'ovWidgets';
// ACTIONS
export const FETCH_OV_WIDGETS_SUCCESS = `${ACTION_PREFIX}FETCH_OV_WIDGETS_SUCCESS`;
// SCHEMA
const ovWidgetSchema = new Schema('ovWidgets');
const ovWidgetsSchema = arrayOf(ovWidgetSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_OV_WIDGETS_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.ovWidgets,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_OV_WIDGETS_SUCCESS:
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
const getOvWidgetsIds = state => state[reducerMountPoint].ids;
const getOvWidgetsById = state => state[reducerMountPoint].byId;
export const getOvWidgets = createSelector(
  [getOvWidgetsIds, getOvWidgetsById],
  (ovWidgetsIds, ovWidgetsById) => ovWidgetsIds.map(id => ovWidgetsById[id])
);
export const setOvWidgets = response => ({
  type: FETCH_OV_WIDGETS_SUCCESS,
  response: normalize(response, ovWidgetsSchema),
});
