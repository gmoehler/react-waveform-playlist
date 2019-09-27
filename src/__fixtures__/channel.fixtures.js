import { partState0 } from "./part.fixtures";
import { initialState as imageInitialState } from "../reducers/imageListReducer";
import { initialState as partInitialState } from "../reducers/partReducer";
import { initialState as markerInitialState } from "../reducers/markerReducer";


export const normalizedImageChannelPayload0 = {
  entities: {
    byChannelId: {
      "channel-1": {
        channelId: "channel-1",
        type: "image",
        sampleRate: 100,
        active: true,
        duration: 55.5,
        gain: 1,
        playState: "stopped",
        parts: ["part-1"]
      }
    }
  },
  result:
    "channel-1"
};

export const imageChannelState0 = {
  byChannelId: {
    "channel-1": {
      channelId: "channel-1",
      type: "image",
      sampleRate: 100,
      active: true,
      duration: 55.5,
      gain: 1,
      playState: "stopped",
      parts: ["part-1"]
    },
  },
  allChannelIds: ["channel-1"],
};

export const fullChannelState0 = {
  entities: {
    channels: imageChannelState0
  }
};

export const denormChannelPayload0 = {
  type: "image",
  sampleRate: 100,
  duration: 55.5,
  parts: [{
    imageId: "image1.png",
    offset: 0,
    duration: 1,
  },
  {
    imageId: "image2.png",
    offset: 2,
    duration: 2,
  }]
};

export const normalizedImageChannel0 = {
  entities: {
    byChannelId: {
      "channel-1": {
        channelId: "channel-1",
        type: "image",
        sampleRate: 100,
        active: true,
        duration: 55.5,
        gain: 1,
        playState: "stopped",
        parts: [undefined]
      }
    },
    byPartId: {
      undefined: {
        imageId: "image1.png",
        offset: 0,
        duration: 1,
      }
    }
  },
  result:
    "channel-1"
};

export const channelPayload0WithoutSampleRate = {
  ...denormChannelPayload0
};
delete channelPayload0WithoutSampleRate.sampleRate;


export const audioChannelPayload = {
  src: "some source.mp3",
  type: "audio",
  offset: 2.0,
  buffer: {
    length: 10,
    // real channels have more fields here
  }
};

export const imageChannelPayload = {
  type: "image",
  sampleRate: 100,
  active: false,
  duration: 55.5,
  parts: ["part-1"]
};

export const initialImageChannelPayload = {
  type: "image",
  sampleRate: 100,
  active: true,
  gain: 1,
  duration: 10,
  playState: "stopped",
};

export const imageChannelState = {
  channel: {
    lastChannelId: 2,
    byChannelId: {
      1: {
        channelId: 1,
        type: "image",
        playState: "stopped",
        sampleRate: 100,
        duration: 21.21,
        active: true,
        parts: [],
      },
      2: {
        channelId: 2,
        type: "image",
        playState: "stopped",
        sampleRate: 100,
        duration: 21.21,
        active: true,
        parts: ["part-1"],
      }
    } // byChannelId
  }, // channel
  entities: {
    parts: partState0,
    images: imageInitialState,
    markers: {
      byMarkerId: {
        "part-1--left": {
          markerId: "part-1--left",
          partId: "part-1",
          pos: 22.34,
          type: "selected",
          channelId: 2
        },
        "part-1--right": {
          markerId: "part-1--right",
          partId: "part-1",
          pos: 22.99,
          type: "selected",
          channelId: 2
        }
      },
      allMarkerIds: ["part-1--left", "part-1--right"],
    }
  }
};

export const part = {
  partId: "2:1",
  imageId: "image-1",
  channelId: 2,
  offset: 3.3,
  duration: 11.21,
  sampleRate: 100,
};

export const normalizedPart = {
  entities: {
    parts: {
      "part-1": {
        partId: "part-1",
        imageId: "image-1",
        channelId: 2,
        offset: 3.3,
        duration: 11.21,
        sampleRate: 100,
      }
    }
  },
  result:
    "part-1"
};

export const normalizedPartCh1 = {
  entities: {
    parts: {
      "part-1": {
        partId: "part-1",
        imageId: "image-1",
        channelId: 1,
        offset: 3.3,
        duration: 11.21,
        sampleRate: 100,
      }
    }
  },
  result:
    "part-1"
};

export const part2 = {
  partId: "2:5",
  imageId: "image-2",
  channelId: 3,
  offset: 5.5,
  duration: 55.55,
  sampleRate: 100,
};