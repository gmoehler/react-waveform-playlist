
import { normalize } from "normalizr";
import { CLEAR_PARTS, ADD_A_PART, DELETE_A_PART, RESIZE_A_PART, MOVE_A_PART, SELECT_A_PART, DESELECT_A_PART, CLEAR_SELECTION } from "./types";
import { getChannelId, partSchema, doesPartExist, getPart, isPartSelected } from "../reducers/partReducer";
import { deletePartSelectionMarkers, addPartSelectionMarkers } from "./markerActions";

// first id will be 1 to avoid falsy ids
let lastPartId = 0;

function generateId() {
  // simple generator :-)
  // other options: cuid or uuid
  lastPartId++;
  return "part-" + lastPartId.toString();
}

// create part id and add the part to the parts entities and channel
// returns the new part id
export const createPart = (partInfo) => {
  return (dispatch, getState) => {
    // ensure we have what we need
    // so reducers do not need to check assumptions
    // TODO: remove channelId number checking once channel ids are strings
    if (partInfo.imageId && partInfo.channelId != null
      && partInfo.offset != null && partInfo.duration != null) {

      const partId = generateId();
      // add part with new part id
      dispatch(_addPart({
        ...partInfo,
        partId,
      }));
      // const bla = normalize(partInfo, partSchema);
      return partId;
    }
    console.error("cannot add incomplete part:", partInfo);
    return null;
  };
};

const _addPart = (partInfo) => ({
  type: ADD_A_PART,
  // normalize for easy usage in partReducer
  // also add channelId for channelReducer
  payload: {
    ...normalize(partInfo, partSchema),
    channelId: partInfo.channelId
  }
});

export const deleteAPart = (partId) => {
  return (dispatch, getState) => {
    // ensure we have what we need
    // so reducers do not need to check assumptions
    // TODO: remove channelId number checking once channel ids are strings
    const channelId = getChannelId(getState(), partId);

    if (partId && channelId != null) {
      dispatch(_deletePart({
        partId,
        channelId
      }));
    } else {
      console.error("cannot remove non-existing part:", partId);
    }
  };
};

const _deletePart = (partIdAndChannelId) => ({
  type: DELETE_A_PART,
  // no normalization should not be required since we can achieve this with partId and channelId alone
  payload: partIdAndChannelId,
});

export const clearParts = () => ({
  type: CLEAR_PARTS
});

export const moveAPart = (moveInfo) => {
  return (dispatch, getState) => {
    // ensure we have what we need
    // so reducers do not need to check assumptions

    if (moveInfo.partId) {
      moveInfo.incr = moveInfo.incr || 0;
      dispatch(_movePart(moveInfo));
    } else {
      console.error("part does not have enough information to be moved:", moveInfo);
    }
  };
};

export const _movePart = (moveInfo) => ({
  type: MOVE_A_PART,
  payload: moveInfo
});

export const resizeAPart = (resizeInfo) => {
  return (dispatch, getState) => {
    // ensure we have what we need
    // so reducers do not need to check assumptions

    if (resizeInfo.partId &&
      ["left", "right"].includes(resizeInfo.bound)) {
      resizeInfo.incr = resizeInfo.incr || 0;
      dispatch(_resizePart(resizeInfo));
    } else {
      console.error("part does not have enough information to be resized:",
        resizeInfo);
    }
  };
};

export const _resizePart = (resizeInfo) => ({
  type: RESIZE_A_PART,
  payload: resizeInfo
});

export const selectAPart = (partId) => {
  return (dispatch, getState) => {
    // ensure that part exists
    if (doesPartExist(getState(), partId)) {
      dispatch(_selectPart(partId));
    } else {
      console.error("part to select does not exist:", partId);
    }
  };
};

export const _selectPart = (partId) => ({
  type: SELECT_A_PART,
  payload: partId
});

export const deselectAPart = (partId) => {
  return (dispatch, getState) => {
    // ensure that part exists
    if (doesPartExist(getState(), partId)) {
      dispatch(_deselectPart(partId));
    } else {
      console.error("part to deselect does not exist:", partId);
    }
  };
};

export const _deselectPart = (partId) => ({
  type: DESELECT_A_PART,
  payload: partId
});

export const clearSelection = () => ({
  type: CLEAR_SELECTION
});


// only one part can be selected (for single click)
export const toggleAPartSelection = ((partId) => {
  return (dispatch, getState) => {

    // check required params for action to work
    if (partId && doesPartExist(partId)) {

      const partAlreadySelected = isPartSelected(getState(), partId);
      dispatch(clearSelection());
      dispatch(deletePartSelectionMarkers(partId));

      if (!partAlreadySelected) {
        const part = getPart(getState(), partId);
        dispatch(clearSelection());
        dispatch(selectAPart(partId));
        dispatch(addPartSelectionMarkers(part));
      }
    }
  };
});

// many parts can be selected (for ctrl-click)
export const toggleMultiPartSelection = ((partId) => {
  return (dispatch, getState) => {

    // check condition
    if (partId && doesPartExist(partId)) {
      if (isPartSelected(getState(), partId)) {
        dispatch(deselectAPart(partId));
        dispatch(deletePartSelectionMarkers(partId));
      } else {
        const part = getPart(getState(), partId);
        dispatch(selectAPart(partId));
        dispatch(addPartSelectionMarkers(part));
      }
    }
  };
});