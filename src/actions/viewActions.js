import { SELECT, SET_ZOOM_LEVEL, SET_MODE } from './types';

// load audio async action


export const select = (selectInfo) => ({
  type: SELECT,
  payload: selectInfo
});

export const setZoomLevel = (zoomInfo) => ({
  type: SET_ZOOM_LEVEL,
  payload: zoomInfo
});

export const setMode = (modeInfo) => ({
  type: SET_MODE,
  payload: modeInfo
})