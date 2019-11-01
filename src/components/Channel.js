import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";
import { getMouseEventPosition } from "../utils/eventUtils";
import ChannelMarkersContainer from "./ChannelMarkersContainer";

const MAX_CANVAS_WIDTH = 1000;

const Waveform = styled.canvas`
  float: left;
  position: relative;
  margin: 0;
  padding: 0;
  width: ${props => props.cssWidth}px;
  height: ${props => props.waveHeight}px;
`;

const WaveformCanvases = styled.div`
  float: left;
  position: relative;
  left: ${props => props.offset}px;
  background: ${props => props.theme.waveFillColor};
`;

// need position:relative so children will respect parent margin/padding
const ChannelWrapper = styled.div`
  position: relative; 
  margin: 0;
  padding: 0;
  background: ${props => props.theme.waveOutlineColor};
  width: ${props => props.cssWidth + 2}px;
  height: ${props => props.waveHeight}px;
  border: 1px solid ${props => props.borderColor}; 
`;

class Channel extends Component {
  constructor(props) {
    super(props);
    this.canvases = [];
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw() {
    const { peaks, bits, /* length,*/ waveHeight, theme, scale } = this.props;

    let offset = 0;
    for (let i = 0; i < this.canvases.length; i++) {
      const canvas = this.canvases[i];
      if (!canvas) {
        break; // TODO: find out how to reset canvases on new render
      }
      const cc = canvas.getContext("2d");
      const h2 = waveHeight / 2;
      const maxValue = 2 ** (bits - 1);

      cc.clearRect(0, 0, canvas.width, canvas.height);
      cc.fillStyle = theme.waveOutlineColor;
      cc.scale(scale, scale);

      const peakSegmentLength = canvas.width / scale;
      for (let i = 0; i < peakSegmentLength; i += 1) {
        const minPeak = peaks[(i + offset) * 2] / maxValue;
        const maxPeak = peaks[((i + offset) * 2) + 1] / maxValue;

        const min = Math.abs(minPeak * h2);
        const max = Math.abs(maxPeak * h2);

        // draw max
        cc.fillRect(i, 0, 1, h2 - max);
        // draw min
        cc.fillRect(i, h2 + min, 1, h2 - min);
      }

      offset += MAX_CANVAS_WIDTH;
    }
  }

  handleMouseEvent(e, eventName) {
    if (this.props.handleMouseEvent) {
      e.preventDefault();
      const pos = getMouseEventPosition(e, "ChannelWrapper");
      const shiftKey = e.shiftKey;
      const adaptedEventName = shiftKey ? "shift-" + eventName : eventName;
      const eventInfo = {
        ...pos, // x pos, channelId, partId
        timestamp: e.timeStamp,
        // no drag source path
      };
      this.props.handleMouseEvent(adaptedEventName, eventInfo);

      return;
    }
  }

  createCanvasRef(i) {
    return (canvas) => {
      this.canvases[i] = canvas;
    };
  }

  render() {
    const { length, waveHeight, scale, progress,
      theme, offset, selected, channelId } = this.props;

    let totalWidth = length;
    let waveformCount = 0;
    const waveforms = [];
    while (totalWidth > 0) {
      const currentWidth = Math.min(totalWidth, MAX_CANVAS_WIDTH);
      const waveform = (
        <Waveform key={ `${length}-${waveformCount}` }
          cssWidth={ currentWidth }
          width={ currentWidth * scale }
          height={ waveHeight * scale }
          waveHeight={ waveHeight }
          ref={ this.createCanvasRef(waveformCount) }
        />);

      waveforms.push(waveform);
      totalWidth -= currentWidth;
      waveformCount += 1;
    }

    const borderColor = selected ? theme.borderColorSelected : theme.borderColor;

    return (<ChannelWrapper className="ChannelWrapper"
      onMouseDown={ (e) => this.handleMouseEvent(e, "mouseDown") }
      onMouseUp={ (e) => this.handleMouseEvent(e, "mouseUp") }
      onMouseMove={ (e) => this.handleMouseEvent(e, "mouseMove") }
      onMouseLeave={ (e) => this.handleMouseEvent(e, "mouseLeave") }
      cssWidth={ length }
      theme={ theme }
      waveHeight={ waveHeight }
      borderColor={ borderColor }>
      <WaveformCanvases className="WaveformCanvases"
        theme={ theme }
        offset={ offset }>
        {waveforms}
      </WaveformCanvases>
      <ChannelMarkersContainer
        channelId={ channelId }
        progress={ progress }
        theme={ theme } />
    </ChannelWrapper>
    );
  }
}

Channel.propTypes = {
  channelId: PropTypes.string.isRequired,
  scale: PropTypes.number,
  progress: PropTypes.number,
  cursorPos: PropTypes.number,
  selection: PropTypes.exact({
    from: PropTypes.number,
    to: PropTypes.number,
    type: PropTypes.string,
  }).isRequired,
  markers: PropTypes.arrayOf(PropTypes.object),
  theme: PropTypes.object,
  maxWidth: PropTypes.number,
  selected: PropTypes.bool,
  handleMouseEvent: PropTypes.func,
  factor: PropTypes.number,
  length: PropTypes.number,
  offset: PropTypes.number,
  peaks: PropTypes.object,
  bits: PropTypes.number,
  waveHeight: PropTypes.number,
};

Channel.defaultProps = {
  // checking `window.devicePixelRatio` when drawing to canvas.
  scale: 1,
  offset: 0,
  peaks: [],
  length: 0,
  bits: 0,
  // height in CSS pixels of each canvas element a waveform is on.
  waveHeight: 92,
  // all x pixel values are from 0 regardless of offset
  // width in CSS pixels of the progress on the channel  (not drawn on null)
  progress: null,
  // position of the cursor in CSS pixels from the left of channel (not drawn on null)
  cursorPos: null,
  // position of the selection in CSS pixels from the left of channel (not drawn on null)
  selection: null,
  // positions of the markers in CSS pixels from the left of channel (null: do not draw)
  markers: [],
};

export default withTheme(Channel);
