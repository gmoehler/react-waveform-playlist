import { SELECT_RANGE, DESELECT_RANGE, SET_RESOLUTION, 
  UPDATE_MARKER, SET_MARKER, DELETE_MARKER, SELECT_PART_OR_IMAGE, 
  DESELECT_PART_OR_IMAGE, CLEAR_VIEW, SELECT_IMAGE_CHANNEL, COPY_PART, 
  ADD_ELEMENT_TO_SEL, REMOVE_ELEMENT_FROM_SEL, CLEAR_SEL} from "./types";

import { getSelectedPart, getSelectedImage, isElementSelected } from "../reducers/viewReducer";

export const clearView = () => ({
  type: CLEAR_VIEW
});

export const selectRange = (selectInfo) => ({
  type: SELECT_RANGE,
  payload: selectInfo
});

export const deselectRange = () => ({
  type: DESELECT_RANGE
});

export const setResolution = (resolutionInfo) => ({
  type: SET_RESOLUTION,
  payload: resolutionInfo
});

export const setMarker = (markerInfo) => ({
  type: SET_MARKER,
  payload: markerInfo
});

export const deleteMarker = (markerInfo) => ({
  type: DELETE_MARKER,
  payload: markerInfo
});

// keeps type when type is null
export const updateMarker = (markerInfo) => ({
  type: UPDATE_MARKER,
  payload: markerInfo
});

export const addElemToSel = (elementInfo) => ({
  type: ADD_ELEMENT_TO_SEL,
  payload: elementInfo
});

export const remElemFromSel = (elementInfo) => ({
  type: REMOVE_ELEMENT_FROM_SEL,
  payload: elementInfo
});

export const clearSel = () => ({
  type: CLEAR_SEL
});

const setSelected = (partOrImageInfo) => ({
  type: SELECT_PART_OR_IMAGE,
  payload: partOrImageInfo
});

export const deselect = () => ({
  type: DESELECT_PART_OR_IMAGE,
});

export const selectImageChannel = (channelInfo) => ({
  type: SELECT_IMAGE_CHANNEL,
  payload: channelInfo
});

export const copyPart = () => ({
  type: COPY_PART
});

const updateMarkers = (dispatch, part) => {
  const type = part.selected ? "selected" : "normal";
  const markerIdPrefix = `${part.partId}`;
  dispatch(updateMarker({
    markerId: markerIdPrefix + "-l",
    channelId: part.channelId,
    partId: part.partId,
    incr: 0,
    type
  }));
  dispatch(updateMarker({
    markerId: markerIdPrefix + "-r",
    channelId: part.channelId,
    partId: part.partId,
    incr: 0,
    type
  }));
};

// partinfo is channelld, partId and selected
// imageinfo is imageId
export const selectPartOrImage = ((partOrImageInfo) => {
  return (dispatch, getState) => {
    const curSelPart = getSelectedPart(getState());
    const curSelImage = getSelectedImage(getState());

    // toggle selection state for multi-elem-selection
    if (isElementSelected(getState(), partOrImageInfo)) {
      dispatch(remElemFromSel(partOrImageInfo));
    } else {
      dispatch(addElemToSel(partOrImageInfo));
    }

    if (curSelPart) {
      // de-select markers of currently selected part
      const curUnselPart = {
        ...curSelPart
      };
      curUnselPart.selected = false;
      updateMarkers(dispatch, curUnselPart);

      // clicked on selected part to deselect
      if (curSelPart.channelId === partOrImageInfo.channelId &&
        curSelPart.partId === partOrImageInfo.partId) {
        dispatch(deselect());
        dispatch(remElemFromSel(partOrImageInfo));
        return;
      }
    }

    if (curSelImage) {
      // clicked on selected image to deselect
      if (curSelImage.imageId === partOrImageInfo.imageId) {
        dispatch(deselect());
        return;
      }
    }

    // clicked on unselected part
    dispatch(setSelected(partOrImageInfo));
    dispatch(selectImageChannel(partOrImageInfo));
    if (partOrImageInfo.partId) {
      // for parts only
      updateMarkers(dispatch, partOrImageInfo);
    }
  };
});

// partinfo is channelld, partId and selected
// imageinfo is imageId
export const toggleElementSelection = ((elementInfo) => {
  return (dispatch, getState) => {
    if (isElementSelected(getState(), elementInfo)) {
      dispatch(clearSelectionWithMarkers());
    } else {
      clearSelectionWithMarkers());
      dispatch(addElemToSel(elementInfo));
      const elCopy = cloneDeep(elementInfo);
      elCopy.selected = true;
      updateMarkers(dispatch, elCopy);
    }
  };
});

// remove markers and clear selection
const clearSelectionWithMarkers = () => {
	return (dispatch, getState) => {
	getSelectedElements(getState()).forEach((el) =>
         el.selected = false;
         updateMarkers(dispatch, el);
    }
    dispatch(clearSel());
    }
}

export const toggleElementMultiSelection = ((elementInfo) => {
  return (dispatch, getState) => {
    
    const elCopy = cloneDeep(elementInfo);
    
    if (isElementSelected(getState(), elementInfo)) {
      dispatch(remElemFromSel(elementInfo));
      elCopy.selected = false;
      updateMarkers(dispatch, elCopy);
    } else {
      dispatch(addElemToSel(elementInfo));
      elCopy.selected = true;
      updateMarkers(dispatch, elCopy);
    }
  };
});

