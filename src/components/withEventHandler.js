/*
 HOC to support mouse and keyboard events
*/

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import MouseHandler from "../handler/MouseHandler";

export function withEventHandler(WrappedComponent) {

  class WithEventHandler extends PureComponent {
    constructor(props) {
      super(props);
      this.mousehandler = null;
    }

    componentDidMount() {
      // mouse handler setup
      this.mousehandler = new MouseHandler({
        selectRange: this.props.selectRange,
        deselectRange: this.props.deselectRange,
        move: this.props.move,
        updateMarker: this.props.updateMarker,
        moveSelectedMarkers: this.props.moveSelectedMarkers,
        setMarker: this.props.setMarker,
        insertNewPart: this.props.insertNewPart,
        toggleElementSelection: this.props.toggleElementSelection,
        toggleElementMultiSelection: this.props.toggleElementMultiSelection,
        deleteSelectedPartAndMarkers: this.props.deleteSelectedPartAndMarkers,
      });
    }

    render() {

      const { selectRange, deselectRange, move, updateMarker, setMarker, insertNewPart, toggleElementSelection, 
        deleteSelectedPartAndMarkers, toggleElementMultiSelection, ...passthruProps } = this.props;

      return (<WrappedComponent { ...passthruProps }
          handleMouseEvent={ (eventName, evInfo) => this.mousehandler.handleMouseEvent(eventName, evInfo, this.props.resolution) } />);
    }
  }

  WithEventHandler.propTypes = {
    selectRange: PropTypes.func.isRequired,
    deselectRange: PropTypes.func.isRequired,
    move: PropTypes.func.isRequired,
    updateMarker: PropTypes.func.isRequired,
    moveSelectedMarkers: PropTypes.func.isRequired,
    setMarker: PropTypes.func.isRequired,
    insertNewPart: PropTypes.func.isRequired,
    toggleElementSelection: PropTypes.func.isRequired,
    toggleElementMultiSelection: PropTypes.func.isRequired,
    deleteSelectedPartAndMarkers: PropTypes.func.isRequired,
  };

  return WithEventHandler;

}