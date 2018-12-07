import React, { Component } from 'react';
import { connect } from 'react-redux';

import ChannelGroup from './ChannelGroup'
import { setChannelPlayState, moveChannel } from '../actions/channelActions'
import { select } from '../actions/viewActions'
import { getallChannelsData, getMaxDuration } from '../reducers/channelReducer'
import { getSelectionRange, getZoomLevel, getMode } from '../reducers/viewReducer'

class ChannelGroupContainer extends Component {

  render() {

    return (
      <ChannelGroup {...this.props} />);
  }
}

const mapStateToProps = (state, props) => {
  // get audio data and play state from redux
  return {
    allChannelsData: getallChannelsData(state),
    selection: getSelectionRange(state),
    pixelsPerSecond: getZoomLevel(state),
    maxDuration: getMaxDuration(state),
    mode: getMode(state),
  }
};

const mapDispatchToProps = dispatch => ({
  select: (from, to) => dispatch(select({
    from,
    to
  })),
  move: (channelId, incr) => dispatch(moveChannel({
    channelId, 
    incr
  })),
  setChannelPlayState: (channelId, playState) => dispatch(setChannelPlayState({
    channelId,
    playState
  })),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChannelGroupContainer);