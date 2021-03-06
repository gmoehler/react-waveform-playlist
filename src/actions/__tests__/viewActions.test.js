import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../viewActions";
import * as channelActions from "../channelActions";

import * as types from "../types";
import { imageChannelState, part, normalizedPartCh1 } from "../../__fixtures__/channel.fixtures";
import { initialState as initialViewState } from "../../reducers/viewReducer";

export const mockStore = configureMockStore([thunk]);

describe("view actions", () => {
  it("should set the load progress", () => {

    const store = mockStore({
      view: initialViewState
    });

    const expectedActions = [{
      type: types.INIT_LOAD_PROGRESS,
      payload: 50
    }, {
      type: types.SET_LOAD_PROGRESS,
      payload: 20
    }, {
      type: types.INCR_LOAD_PROGRESS,
      payload: 10
    }];

    store.dispatch(actions.initLoadProgress(50));
    store.dispatch(actions.setLoadProgress(20));
    store.dispatch(actions.incrLoadProgress(10));
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  xit("should paste a part from channel 2 to channel 1", () => {

    const state = {
      ...imageChannelState,
      images: {
        byImageId: {
          "image-1": {
            duration: 11.21,
          }
        }
      },
      view: {
        ...initialViewState,
        partsToCopy: [
          part
        ],
        selectedImageChannelId: 1,
      }
    };

    const store = mockStore(state);

    const expectedActions = [{
      type: types.DELETE_MARKER,
      payload: {
        markerId: "insert"
      }
    }, {
      type: types.ADD_PART,
      payload: {
        ...normalizedPartCh1,
      }
    }, {
      type: types.SET_MARKER,
      payload: {
        "channelId": 1,
        "markerId": "1:2-l",
        "partId": "1:2",
        "pos": 3.3,
        "type": "normal",
      }
    }, {
      type: types.SET_MARKER,
      payload: {
        "channelId": 1,
        "markerId": "1:2-r",
        "partId": "1:2",
        "pos": 11.21 + 3.3,
        "type": "normal",
      }
    }, {
      type: types.SELECT_IMAGE_CHANNEL,
      payload: {
        channelId: 1,
        partId: "1:2",
        selected: true
      }
    }, {
      type: types.CLEAR_SEL
    }, {
      type: types.ADD_ELEMENT_TO_SEL,
      payload: {
        channelId: 1,
        partId: "1:2",
        selected: true
      }
    }, {
      type: types.UPDATE_MARKER,
      payload: {
        incr: undefined,
        markerId: "1:2-l",
        pos: undefined,
        type: "selected"
      }
    }, {
      type: types.UPDATE_MARKER,
      payload: {
        incr: undefined,
        markerId: "1:2-r",
        pos: undefined,
        type: "selected"
      }
    }
    ];

    store.dispatch(channelActions.pastePart(part));
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);

  });

});