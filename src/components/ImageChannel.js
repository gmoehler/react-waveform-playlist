import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";
import deepEqual from "fast-deep-equal";

const MAX_CANVAS_WIDTH = 1000;

const ImageCanvas = styled.canvas`
  float: left;
  position: relative;
  margin: 0;
  padding: 0;
  width: ${props => props.cssWidth}px;
  height: ${props => props.height}px;
  border-left: ${props => props.channelSelected ? 2 : 1}px solid ${props => props.theme.markerColor};
  border-right:  ${props => props.channelSelected ? 2 : 1}px solid ${props => props.theme.markerColor};
`;

const CanvasRefImage = styled.img`
  display: none;
`;

const ImageCanvases = styled.div`
  float: left;
  position: absolute;
  left: ${props => props.offset}px;
  cursor: ${props => props.cursor};
`;

class ImageChannel extends Component {
  constructor(props) {
    super(props);
    this.canvaseRefs = [];
    this.imageRefs = [];
  }

  componentDidMount() {
    this.draw();
  }

  shouldComponentUpdate(nextProps) {
    // shallow comparison ("pure") for all but parts
    //TODO: find a way to make shallow equal work
    let doUpdate = false;
    Object.entries(this.props).forEach(([key, val]) => {
      if (key === "parts") {
        if (!deepEqual(nextProps.parts, this.props.parts)) {
          doUpdate = true;
        }
      }
      else if (nextProps[key] !== val) {
        doUpdate = true;
      }
    });
    return doUpdate;
  }

  componentDidUpdate(prevProps, prevState) {
    this.draw();
    /*
    Object.entries(this.props).forEach(([key, val]) =>
      prevProps[key] !== val && console.log(`IC: Prop '${key}' changed`)
    );
    if (this.state) {
      Object.entries(this.state).forEach(([key, val]) =>
        prevState[key] !== val && console.log(`IC: State '${key}' changed`)
      );
    } */
  }

  draw() {
    const { imageHeight, scale, factor } = this.props;

    Object.keys(this.imageRefs).forEach((idx) => {

      const img = this.imageRefs[idx];
      let canvasOffset = 0; // TODO: use cue
      if (!img) {
        return;
      }

      for (let c = 0; c < this.canvaseRefs[idx].length; c++) {
        const canvas = this.canvaseRefs[idx][c];
        if (!canvas) {
          break;
        }

        const cc = canvas.getContext("2d");
        cc.clearRect(0, 0, canvas.width, canvas.height);

        const imageOffset = canvasOffset / factor;

        cc.scale(scale, scale);
        if (img.src) {
          img.onload = cc.drawImage(img, imageOffset, 0, img.width, img.height,
            0, 0, canvas.width, imageHeight);
        } else {
          cc.fillStyle = "#FF0000"; // red rectangle if image is missing
          cc.fillRect(0, 0, canvas.width, imageHeight);
        }
        canvasOffset += MAX_CANVAS_WIDTH;
      }
    });
  }

  createCanvasRef(i, c) {
    return (canvas) => {
      if (!this.canvaseRefs[i]) {
        this.canvaseRefs[i] = [];
      }
      this.canvaseRefs[i][c] = canvas;
    };
  }

  createImageRef(i) {
    return (image) => {
      this.imageRefs[i] = image;
    };
  }

  render() {
    const { parts, imageHeight, scale, theme, selected, images } = this.props;

    // loop thru all images/parts
    const allImageCanvases = [];
    const allCanvasRefImages = [];
    this.canvaseRefs = [];
    this.imageRefs = [];

    if (parts && Array.isArray(parts)) {

      parts.forEach((part) => {

        const { partId, imageId, offset, duration } = {
          ...part
        };

        const src = images[imageId].src;

        // paint images of canvases with max with MAX_CANVAS_WIDTH
        const canvasImages = [];
        let totalWidth = duration;
        let canvasCount = 0;

        while (totalWidth > 0) {
          const currentWidth = Math.min(totalWidth, MAX_CANVAS_WIDTH);
          const canvasImage = (
            <ImageCanvas key={ String(partId) + "-" + String(canvasCount) }
              cssWidth={ currentWidth }
              width={ currentWidth * scale }
              height={ imageHeight + 2 }
              ref={ this.createCanvasRef(partId, canvasCount) }
              data-partid={ partId }
              theme={ theme }
              channelSelected={ selected }
            />
          );

          canvasImages.push(canvasImage);
          totalWidth -= currentWidth;
          canvasCount += 1;
        }
        allImageCanvases.push(
          <ImageCanvases key={ partId }
            className="ImageCanvases"
            theme={ theme }
            offset={ offset }
            cursor={ "hand" }>
            {canvasImages}
          </ImageCanvases>
        );
        allCanvasRefImages.push(
          <CanvasRefImage
            key={ partId }
            src={ src }
            className="hidden"
            ref={ this.createImageRef(partId) } />
        );
      });
    }

    return (
      <Fragment>
        {allCanvasRefImages}
        {allImageCanvases}
      </Fragment>
    );
  }
}

ImageChannel.propTypes = {
  theme: PropTypes.object,
  scale: PropTypes.number,
  factor: PropTypes.number,
  maxWidth: PropTypes.number,

  parts: PropTypes.arrayOf(
    PropTypes.shape({
      partId: PropTypes.string.isRequired,
      offset: PropTypes.number, // might be zero
      duration: PropTypes.number.isRequired,
    })),
  images: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  imageHeight: PropTypes.number, // currently only default
};

ImageChannel.defaultProps = {
  factor: 1,
  // checking `window.devicePixelRatio` when drawing to canvas.
  scale: 1,
  offset: 0,
  maxWidth: 800,

  // height in CSS pixels of each canvas element an image is on.
  imageHeight: 90, // multiple of num LEDs
};

export default withTheme(ImageChannel);
