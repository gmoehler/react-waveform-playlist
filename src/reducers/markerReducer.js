import { cloneDeep, omit } from "lodash";
import { CLEAR_MARKERS, SET_OR_REPLACE_MARKER, DELETE_MARKER, UPDATE_MARKER, } from "../actions/types";
import { combineReducers } from "redux";

export const initialState = {
  byMarkerId: {},
  allMarkerIds: []
};

const byMarkerId = (state = {}, action) => {
  switch (action.type) {

    case CLEAR_MARKERS:
      return {};

    case SET_OR_REPLACE_MARKER:
      return {
        ...state,
        [action.payload.markerId]: action.payload
      };

    case DELETE_MARKER:
      const newByMarkerId = cloneDeep(state);
      delete newByMarkerId[action.payload];
      return newByMarkerId;

    case UPDATE_MARKER:
      // update marker type, and pos by either incr or pos
      // expecting markerId, and incr or pos or type
      // if marker does not yet exist: do nothing
      const prevMarker = state[action.payload.markerId];
      let pos = prevMarker.pos;
      if (action.payload.incr) {
        pos = Math.max(0, prevMarker.pos + action.payload.incr);
      } else if (typeof action.payload.pos == "number") {
        pos = action.payload.pos;
      }
      const type = action.payload.type || prevMarker.type;
      return {
        ...state,
        [action.payload.markerId]: {
          ...prevMarker,
          pos,
          type
        }
      };

    default:
      return state;
  }
};

const allMarkerIds = (state = [], action) => {
  switch (action.type) {

    case CLEAR_MARKERS:
      return [];

    case SET_OR_REPLACE_MARKER:
      return state.includes(action.payload.markerId) ?
        state : [...state, action.payload.markerId];

    case DELETE_MARKER:
      return state.filter(p => p !== action.payload);

    case UPDATE_MARKER:
      return state;

    default:
      return state;
  }
};

export default combineReducers({
  byMarkerId,
  allMarkerIds,
});

export const getAllMarkers = (state) => {
  return Object.values(state.entities.markers.byMarkerId);
};

export const getAllMarkerIds = (state) => {
  return state.entities.markers.allMarkerIds
    .sort((mId1, mId2) => {
      // insert markers first (first letter 'i' vs 'p' / 't')
      // so that existing markers are above the insert marker
      return mId1.localeCompare(mId2);
    });;
};

export const getAllMarkerPosOfType = (state, type) => {
  return Object.values(state.entities.markers.byMarkerId)
    .filter((marker) => marker.type === type)
    .map((marker) => marker.pos)
    .sort();
};

// for file export
export const getAllMarkersOfType = (state, type) => {
  return Object.values(state.entities.markers.byMarkerId)
    .filter((marker) => marker.type === type)
    .map((marker) => omit(marker, ["markerId"]));
};

export const getMarker = (state, markerId) => {
  return state.entities.markers.byMarkerId[markerId];
};

export const markerExists = (state, id) =>
  state.entities.markers.allMarkerIds.includes(id);