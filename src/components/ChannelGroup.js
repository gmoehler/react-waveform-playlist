import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { CircularProgress } from "@material-ui/core";
import Channel from "./Channel";
import ImageChannel from "./ImageChannel";
import TimeScale from "./TimeScale";
import { withPlay } from "./withPlay";
import { withEventHandler } from "./withEventHandler";
import { timeToPixels } from "./timeToPixels";
import { secondsToPixels } from "../utils/conversions";

const ChannelGroupWrapper = styled.div`
  width:  calc(95vw - ${props => props.drawerWidth}px);
  transition: width .1s;
	overflow: auto;
	white-space: nowrap;
`;

const LoadProgressView = styled(CircularProgress)`
  margin: 20px;
`;

// add play functionality to audio channels
const AudioChannelWithPlay = withEventHandler(withPlay(timeToPixels(Channel)));
const ImageChannelWithPlay = withEventHandler(withPlay(timeToPixels(ImageChannel)));
const TimeScaleInSecs = timeToPixels(TimeScale);

// contains multiple AudioChannels
export default class ChannelGroup extends Component {
  constructor(props) {
    super(props);
    this.groupRef = null;
    this.state = {
      scrollLeft: 0,
    };
  }

  componentDidUpdate() {
    this.considerScroll();
  }

  considerScroll = () => {
    if (this.props.playState === "playing" && this.groupRef) {
      const scrolldiff = Math.abs(this.state.scrollLeft - this.groupRef.scrollLeft);
      if (scrolldiff > 10) { // do it only once for all channels
        this.groupRef.scrollLeft = this.state.scrollLeft;
      }
    }
  }

  reportProgress = (progress) => {
    // check progress to do autoscrolling 
    const progressPx = secondsToPixels(progress, this.props.resolution);
    if (progressPx > this.groupRef.scrollLeft + this.groupRef.clientWidth) {
      this.setState({
        scrollLeft: progressPx
      });
    } else if (progressPx < this.groupRef.scrollLeft) {
      this.setState({
        scrollLeft: progressPx
      });
    }
  }

  render() {

    if (this.props.isUploadingConfig) {
      return (<LoadProgressView disableShrink />);
    }

    // no data: nothing to do
    if (!this.props.allChannelsData.length) {
      return null;
    }

    // we have data sorted by type and id
    const channelComponents = this.props.allChannelsData
      .map((channelData) => {

        const { resolution, selectedImageChannelId, ...passthruProps } = this.props;
        const channelId = channelData.channelId;

        if (channelData.loading) {
          return null;
        }

        // if sampleRate is in config: use it, else: use sampleRate from buffer (audio only)
        const sampleRate = channelData.buffer && channelData.buffer.sampleRate
          ? channelData.buffer.sampleRate : channelData.sampleRate;

        const channelProps = {
          ...passthruProps,
          channelId,
          key: channelId, // required because of list
          type: channelData.type,
          playState: "stopped", // TODO: derive from playingChannels
          offset: channelData.offset,
          selected: channelData.selected,
          gain: channelData.gain,
          sampleRate,
          resolution,
          buffer: channelData && channelData.buffer,
          parts: channelData.parts,
          reportProgress: this.reportProgress,
        };

        if (channelData.type === "audio") {
          return (
            <AudioChannelWithPlay { ...channelProps }
              setChannelPlayState={ playState => this.props.setChannelPlayState(channelId, playState) } />);
        }

        return (
          <ImageChannelWithPlay { ...channelProps }
            selected={ selectedImageChannelId === channelId }
            setChannelPlayState={ playState => this.props.setChannelPlayState(channelId, playState) }
            move={ (partId, incr) => this.props.move(partId, incr) }
            resize={ (partId, markerId, incr) => this.props.resize(channelId, partId, markerId, incr) }
          />);


      });

    return (
      <ChannelGroupWrapper drawerWidth={ this.props.drawerWidth || 0 }
        ref={ (ref) => this.groupRef = ref }>
        <TimeScaleInSecs
          maxDuration={ this.props.maxDuration }
          resolution={ this.props.resolution }
        />
        {channelComponents}
      </ChannelGroupWrapper>
    );
  }
}

ChannelGroup.propTypes = {
  allChannelsData: PropTypes.array, // data of all channels
  resolution: PropTypes.number.isRequired,
  setChannelPlayState: PropTypes.func.isRequired,
  move: PropTypes.func.isRequired,
  resize: PropTypes.func.isRequired,
  drawerWidth: PropTypes.number.isRequired,
  selectedImageChannelId: PropTypes.number,
  playState: PropTypes.string,
  maxDuration: PropTypes.number,
  isUploadingConfig: PropTypes.bool,
};