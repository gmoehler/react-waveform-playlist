import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

import styled, { withTheme } from "styled-components";
import ChannelMarkersContainer from "./ChannelMarkersContainer";
import { useMouseEvent } from "../hooks/useMouseEvent";

const TIME_INFO = {
  20000: {
    marker: 30000,
    bigStep: 10000,
    smallStep: 5000,
    secondStep: 5,
  },
  12000: {
    marker: 15000,
    bigStep: 5000,
    smallStep: 1000,
    secondStep: 1,
  },
  10000: {
    marker: 10000,
    bigStep: 5000,
    smallStep: 1000,
    secondStep: 1,
  },
  5000: {
    marker: 5000,
    bigStep: 1000,
    smallStep: 500,
    secondStep: 1 / 2,
  },
  2500: {
    marker: 2000,
    bigStep: 1000,
    smallStep: 500,
    secondStep: 1 / 2,
  },
  1500: {
    marker: 2000,
    bigStep: 1000,
    smallStep: 200,
    secondStep: 1 / 5,
  },
  700: {
    marker: 1000,
    bigStep: 500,
    smallStep: 100,
    secondStep: 1 / 10,
  },
};

function getScaleInfo(resolution) {
  let keys = Object.keys(TIME_INFO).map(item => parseInt(item, 10));

  // make sure keys are numerically sorted.
  keys = keys.sort((a, b) => a - b);

  for (let i = 0; i < keys.length; i += 1) {
    if (48000 / resolution <= keys[i]) {
      return TIME_INFO[keys[i]];
    }
  }

  return TIME_INFO[keys[0]];
}

function formatTime(milliseconds) {
  const seconds = milliseconds / 1000;
  let s = seconds % 60;
  const m = (seconds - s) / 60;

  if (s < 10) {
    s = `0${s}`;
  }

  return `${m}:${s}`;
}

const PlaylistTimeScale = styled.div`
  width: ${props => props.cssWidth}px;
  position: relative;
  left: 0;
  right: 0;
  height: 30px;
  background: #2c387e;
  color: white;
  cursor: default
`;

const PlaylistTimeScaleScroll = styled.div`
  position: absolute;
  width: ${props => props.cssWidth}px;
  height: 100%;
`;

const TimeTicks = styled.canvas`
  position: absolute;
  width: ${props => props.cssWidth}px;
  height: ${props => props.timeScaleHeight}px;
  left: 0;
  right: 0;
  bottom: 0;
`;

const TimeStamp = styled.div`
  left: ${props => props.pix}px;
  position: absolute;
`;

function TimeScale(props) {

  const { maxWidth, resolution, scale, timeScaleHeight, theme } = props;

  const canvasRef = useRef(null);

  const scaleInfo = getScaleInfo(resolution);
  const canvasInfo = {};
  const timeMarkers = [];
  let counter = 0;

  useEffect(() => {
    draw();
  })

  const handleMouseEvent = useMouseEvent("PlaylistTimeScale", resolution);

  function draw() {
    if (canvasRef) {
      const ctx = canvasRef.current.getContext("2d");

      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
      ctx.fillStyle = theme.timeColor;
      ctx.scale(scale, scale);

      Object.keys(canvasInfo).forEach((x) => {
        const scaleHeight = canvasInfo[x];
        const scaleY = timeScaleHeight - scaleHeight;
        ctx.fillRect(x, scaleY, 1, scaleHeight);
      });
    }
  }

  for (let i = 0; i < maxWidth; i += (resolution * scaleInfo.secondStep)) {
    const pix = Math.floor(i);

    // put a timestamp every 30 seconds.
    if (scaleInfo.marker && (counter % scaleInfo.marker === 0)) {
      const timestamp = formatTime(counter);
      timeMarkers.push(
        <TimeStamp
          key={timestamp}
          pix={pix}>
          {timestamp}
        </TimeStamp>);
      canvasInfo[pix] = timeScaleHeight;
    } else if (scaleInfo.bigStep && (counter % scaleInfo.bigStep === 0)) {
      canvasInfo[pix] = Math.floor(timeScaleHeight / 2);
    } else if (scaleInfo.smallStep && (counter % scaleInfo.smallStep === 0)) {
      canvasInfo[pix] = Math.floor(timeScaleHeight / 5);
    }

    counter += (1000 * scaleInfo.secondStep);
  }

  return (
    <PlaylistTimeScale
      className="PlaylistTimeScale"
      onMouseDown={(e) => handleMouseEvent("mouseDown", e)}
      onMouseUp={(e) => handleMouseEvent("mouseUp", e)}
      onMouseMove={(e) => handleMouseEvent("mouseMove", e)}
      onMouseLeave={(e) => handleMouseEvent("mouseLeave", e)}
      cssWidth={maxWidth}>
      <PlaylistTimeScaleScroll cssWidth={maxWidth}>
        {timeMarkers}
        <TimeTicks cssWidth={maxWidth}
          width={maxWidth * scale}
          height={timeScaleHeight * scale}
          ref={canvasRef}
        />
      </PlaylistTimeScaleScroll>
      <ChannelMarkersContainer
        className="ChannelMarkersContainer"
        theme={theme} />
    </PlaylistTimeScale>
  );

}

TimeScale.propTypes = {
  maxWidth: PropTypes.number,
  resolution: PropTypes.number.isRequired,
  controlWidth: PropTypes.number,
  theme: PropTypes.object,
  scale: PropTypes.number,
  timeScaleHeight: PropTypes.number,
  handleMouseEvent: PropTypes.func.isRequired,
};


TimeScale.defaultProps = {
  scale: 1, // currently always default, could use `window.devicePixelRatio`
  // time length in seconds
  duration: 0,
  samplesPerPixel: 1000,
  // sampleRate: 48000,
  timeScaleHeight: 10,
};

export default withTheme(TimeScale);
