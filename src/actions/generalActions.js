
import { UPLOAD_CONFIG_STARTED, UPLOAD_CONFIG_SUCCESS, UPLOAD_CONFIG_FAILURE } from './types';

import { downloadTextfile, readTextFile, downloadImagefile } from '../utils/fileUtils';
import { getConfig } from '../reducers/rootReducer';

import { addChannel, loadAChannel, updateChannelMarkersForLastAddedChannel } from './channelActions';
import { setCurrentImageFrame } from './viewActions';
import { addImage, loadImage } from './imageListActions';
import { getChannelData, getMaxDuration } from '../reducers/channelReducer';
import { secondsToSamples } from '../utils/conversions';

// load channels and images from config

const uploadConfigStarted = startInfo => ({
  type: UPLOAD_CONFIG_STARTED,
  payload: startInfo
});

const uploadConfigSuccess = channelInfo => ({
  type: UPLOAD_CONFIG_SUCCESS,
  payload: channelInfo
});

const uploadConfigFailure = errorInfo => ({
  type: UPLOAD_CONFIG_FAILURE,
  payload: errorInfo
});

export const uploadConfigFile = (configFile, audioContext) => {
  return (dispatch, getState) => {
    dispatch(uploadConfigStarted());
    console.log("Reading " + configFile.name + "...");

    return readTextFile(configFile)
      .then((data) => {
        const dataObj = JSON.parse(data);
        dispatch(uploadConfig(dataObj, audioContext));
      })
      .then(dispatch(uploadConfigSuccess()))
      .catch(err => {
        console.error(err);
        return dispatch(uploadConfigFailure({
          err
        }))
      })
  }
}

export const uploadConfig = (configData, audioContext) => {
  return (dispatch, getState) => {

    console.log(configData);
    // dispatch(clearView());
    // dispatch(clearImageList());
    // dispatch(clearChannels());

    // load all images and save them to store
    const imageListPromises = configData.images.map((imageData) => loadImage(imageData)
      .then((img) => {
        dispatch(addImage(img));
      }));

    return Promise.all(imageListPromises)
      .then(() => {

        // load all channels
        const channelPromises = configData.channels.map((channelData) => loadAChannel(channelData, audioContext, getState())
          .then((channelInfo) => {
            dispatch(addChannel(channelInfo));
            dispatch(updateChannelMarkersForLastAddedChannel(channelInfo)); // TODO: channelInfo does not know the channel id here...
          }));

        return Promise.all(channelPromises);
      })
  }
};

export const downloadConfig = (() => {
  return (dispatch, getState) => {
    const config = getConfig(getState());
    downloadTextfile("config.json", JSON.stringify(config));
  }
})

export const drawExportImage = (channelId) => {
  return (dispatch, getState) => {
    const data = getChannelData(getState(), channelId);
    if (data && data.byParts) {
      const maxDuration = getMaxDuration(getState());
      const canvas = document.getElementById("imageExportCanvas");
      canvas.height = 30;
      canvas.width =  secondsToSamples(maxDuration, data.sampleRate);

      const cc = canvas.getContext('2d');
      cc.fillStyle = "black";
      cc.fillRect(0,0, canvas.width, canvas.height);

      Object.keys(data.byParts).forEach((partId) => {

        const part = data.byParts[partId];
        const img = document.getElementById(part.imageId);
        const offsetPx = part.offset ? secondsToSamples(part.offset, data.sampleRate) : 0;
        const widthPx = part.duration ? secondsToSamples(part.duration, data.sampleRate) : 0;
        cc.drawImage(img, 0, 0, widthPx, 30,  offsetPx, 0, widthPx, 30);
      })
    }
  }
}

export const exportImageChannel = (channelId) => {
  return (dispatch, getState) => {
    dispatch(drawExportImage(channelId));
    const canvas = document.getElementById("imageExportCanvas");
    const resultImage = canvas.toDataURL("image/png");
    if (resultImage) {
      downloadImagefile(`result-${channelId}.png`, resultImage);
    }
  }
}

export const updateCurrentImageFrame = (updateInfo => {
  return (dispatch, getState) => {
  	// todo: get channel spec image
    const exportCanvas = document.getElementById("imageExportCanvas");
    if (exportCanvas) {
      const exportCc = exportCanvas.getContext('2d');
      const idx = secondsToSamples(updateInfo.time, updateInfo.sampleRate);
      const imgData = exportCc.getImageData(idx, 0, 1, 30);

      dispatch(setCurrentImageFrame({
      	channelId: updateInfo.channelId,
        data: imgData.data,
        playTime: updateInfo.time,
      }));
    }
  }
});

// get image data from export canvas within an interval
// assuming all selected channels are on the canvas
// to acoid retreiving the same frame twice
// we use ceil on the start idx and floor on the end idx
export const getChannelExportData = ((fromTime, toTime, sampleRate) => {
    const exportCanvas = document.getElementById("imageExportCanvas");
  if (exportCanvas) {
    const exportCc = exportCanvas.getContext('2d');
    const fromIdx = secondsToSamples(fromTime, sampleRate);
    const toIdx = secondsToSamples(toTime, sampleRate, false); // floor
    const width = toIdx-fromIdx;
    return {
      width,
      height: exportCanvas.height,
      data: exportCc.getImageData(fromIdx, 0, width, 30),
    };
  }
  return {
    width: 0,
    height: 0,
    data: [],
  };
});

