import {SELECT, SET_ZOOM_LEVEL, SET_MODE} from '../actions/types';

const initialState = {
  selection: {
    from: 0,
    to: 0
  },
  zoomLevel: 1000,
  mode: "selectionMode",
};

export default(state = initialState, action) => {
  switch (action.type) {
    
    case SELECT:
      return {
        ...state,
        selection: {
          from: action.payload.from,
          to: action.payload.to
        }
      };

    case SET_ZOOM_LEVEL:
      return {
        ...state,
        zoomLevel: action.payload
      }

      case SET_MODE:
      return {
        ...state,
        mode: action.payload
      }

    default:
      return state
  }
}

export const getSelectionRange = (state) => {
  return { 
	from: state.view.selection.from,
	to: state.view.selection.to,
	}
}

export const getZoomLevel = (state) => {
  return state.view.zoomLevel
}

export const getMode = (state) => {
  return state.view.mode
}
