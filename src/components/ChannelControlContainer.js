import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadChannel, playChannel, stopChannel } from '../actions/channelActions'
import { setZoomLevel, setMode, select } from '../actions/viewActions'
import ChannelControl from './ChannelControl';
import { loadImageList } from '../actions/imageListActions';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new window.AudioContext();

//const zoomLevels = [6, 12, 24, 48, 96, 192, 384, 768, 1536, 3072, 6144]; // in pixels / sec
const zoomLevels = [4000, 2000, 1000, 500, 250, 125, 80, 40, 20, 10, 5]; // in pixels / sec
const defaultZoomLevelIdx = 6;
const imageSampleRate = 100; // one image frame is 10ms

const channels = [
  {
    src: 'media/audio/Vocals30.mp3',
    name: 'Vocals',
    type: 'audio',
    offset: 2.0,
    cuein: 5.918,
    cueout: 14.5,
  },
  {
    src: 'media/audio/BassDrums30.mp3',
    name: 'Drums',
    type: 'audio',
    offset: 2.2,
    soloed: false,
  },
  {
    id: 'imgChannel1',
    name: 'Channel 1 with images',
    type: 'image',
    sampleRate: imageSampleRate,
    parts: [{
      src: 'media/image/mostlyStripes.png',
      offset: 1.75,
      cuein: 0.5, // in secs
      cueout: 1.47, // in secs
    },
      {
        src: 'media/image/blueLine.png',
        offset: 3.75,
        cuein: 0.5, // in secs
        cueout: 1.47, // in secs
      }],
  },
]

const images = [
  {
    src: 'media/image/mostlyStripes.png'
  },
  {
    src: 'media/image/blueLine.png'
  },
];

/*
const config = {
  sampleRate: imageSampleRate, 
  images,
  channels,
} */

class ChannelControlContainer extends Component {

  constructor(props) {
    super(props);
    this.zoomLevelIdx = defaultZoomLevelIdx;
  }

  doLoad = (event) => {
    this.resetZoom();
    this.props.loadImageListAction({
      sampleRate: imageSampleRate,
      images
    });
    this.props.loadChannelAction({
      channels,
      audioContext,
    });
  }

  resetZoom = () => {
    this.zoomLevelIdx = defaultZoomLevelIdx;
    this.props.setZoomAction(
      zoomLevels[this.zoomLevelIdx]
    )
  }

  zoomIn = () => {
    this.zoomLevelIdx = Math.min(Math.max(parseInt(this.zoomLevelIdx) - 1, 0), zoomLevels.length - 1);
    this.props.setZoomAction(
      zoomLevels[this.zoomLevelIdx]
    )
  }

  zoomOut = () => {
    this.zoomLevelIdx = Math.min(Math.max(parseInt(this.zoomLevelIdx) + 1, 0), zoomLevels.length - 1);
    this.props.setZoomAction(
      zoomLevels[this.zoomLevelIdx]
    )
  }

  setMode = (mode) => {
    this.props.selectAction({
      from: null,
      to: null
    });
    this.props.setModeAction(mode);
  }

  render() {

    return (
      <ChannelControl load={ this.doLoad } loadImageList={ this.doImageList } playChannel={ this.props.playChannelAction } stopChannel={ this.props.stopChannelAction } zoomIn={ this.zoomIn }
        zoomOut={ this.zoomOut } setMode={ this.setMode } />
      );
  }
}

const mapStateToProps = state => ({
  // no props for now
});

const mapDispatchToProps = dispatch => ({
  loadImageListAction: (spec) => dispatch(loadImageList(spec)),
  loadChannelAction: (spec) => dispatch(loadChannel(spec)),
  playChannelAction: () => dispatch(playChannel()),
  stopChannelAction: () => dispatch(stopChannel()),
  setZoomAction: (zoomLevel) => dispatch(setZoomLevel(zoomLevel)),
  setModeAction: (modeEvent) => dispatch(setMode(modeEvent.target.value)),
  selectAction: (range) => dispatch(select(range))
})


export default connect(mapStateToProps, mapDispatchToProps)(ChannelControlContainer);
