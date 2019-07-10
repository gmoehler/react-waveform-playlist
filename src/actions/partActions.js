import {
  CLEAR_PARTS, ADD_A_PART, UPDATE_A_PART, DELETE_A_PART,
} from "./types";

// first id will be 1 to avoid falsy ids
let lastId = 0;

function generateId() {
  // simple generator :-)
  // other options cuid or uuid
  lastId++;
  return "part-" + lastId.toString();
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
      dispatch(addPart({
        ...partInfo,
        partId,
      }));
      return partId;
    }
    console.error("cannot add incomplete part:", partInfo);
    return null;
  };
};

const addPart = (partInfo) => ({
  type: ADD_A_PART,
  payload: partInfo,
});

export const updatePart = (partInfo) => ({
  type: UPDATE_A_PART,
  payload: partInfo,
});

export const deletePart = (partId) => ({
  type: DELETE_A_PART,
  payload: partId,
});

export const clearParts = channelInfo => ({
  type: CLEAR_PARTS,
  payload: channelInfo,
});