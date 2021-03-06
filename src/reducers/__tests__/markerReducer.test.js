import reducer, { initialState, getAllMarkers, markerExists, getAllMarkerPosOfType } from "../markerReducer";
import * as types from "../../actions/types";
import { markerState0, markerPayload0, fullMarkerState0, fullMarkerState1 } from "../../__fixtures__/marker.fixtures";

describe("marker reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should set a new maker", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.SET_OR_REPLACE_MARKER,
      payload: markerPayload0
    });

    expect(reducer0).toEqual(markerState0);
  });

  it("should update a marker by a position increment", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.SET_OR_REPLACE_MARKER,
      payload: markerPayload0
    });
    expect(reducer0).toEqual(markerState0);

    const reducer1 = reducer(reducer0, {
      type: types.UPDATE_MARKER,
      payload: {
        markerId: "part-2--left",
        incr: 0.5,
      }
    });
    expect(reducer1).toEqual({
      byMarkerId: {
        "part-2--left": {
          markerId: "part-2--left",
          partId: "part-2",
          pos: 22.84,
          type: "selected",
        }
      },
      allMarkerIds: ["part-2--left"],
    });
  });



  it("should update a marker by a new position", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.SET_OR_REPLACE_MARKER,
      payload: markerPayload0
    });
    expect(reducer0).toEqual(markerState0);

    const reducer1 = reducer(reducer0, {
      type: types.UPDATE_MARKER,
      payload: {
        markerId: "part-2--left",
        pos: 33.34,
      }
    });
    expect(reducer1).toEqual({
      byMarkerId: {
        "part-2--left": {
          markerId: "part-2--left",
          partId: "part-2",
          pos: 33.34,
          type: "selected",
        }
      },
      allMarkerIds: ["part-2--left"],
    });
  });

  it("should update the type of a marker", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.SET_OR_REPLACE_MARKER,
      payload: markerPayload0
    });
    expect(reducer0).toEqual(markerState0);

    const reducer1 = reducer(reducer0, {
      type: types.UPDATE_MARKER,
      payload: {
        markerId: "part-2--left",
        type: "right",
      }
    });
    expect(reducer1).toEqual({
      byMarkerId: {
        "part-2--left": {
          markerId: "part-2--left",
          partId: "part-2",
          pos: 22.34,
          type: "right",
        }
      },
      allMarkerIds: ["part-2--left"],
    });
  });

  it("should delete a marker", () => {

    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.SET_OR_REPLACE_MARKER,
      payload: markerPayload0
    });

    expect(reducer0).toEqual(markerState0);

    const reducer1 = reducer(reducer0, {
      type: types.DELETE_MARKER,
      payload: "part-2--left",
    });

    expect(reducer1).toEqual({
      ...initialState,
    });
  });


  it("should clear all markers", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.SET_OR_REPLACE_MARKER,
      payload: markerPayload0
    });

    expect(reducer0).toEqual(markerState0);

    const reducer1 = reducer(reducer0, {
      type: types.CLEAR_MARKERS,
    });

    expect(reducer1).toEqual({
      ...initialState,
    });

  });

});

describe("marker selector functions", () => {

  it("should get all markers", () => {
    expect(getAllMarkers(fullMarkerState0)).toEqual([markerPayload0]);
  });

  it("check whether marker exists", () => {
    expect(markerExists(fullMarkerState0, "part-2--left")).toBeTruthy();
  });

  it("should sort the marker offsets", () => {
    expect(getAllMarkerPosOfType(fullMarkerState1, "selected"))
      .toEqual([20.34, 22.34]);
  });


});