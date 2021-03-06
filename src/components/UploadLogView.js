import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Modal, Typography, Button, CircularProgress } from "@material-ui/core";

export const doneMessage = "Upload completed.";
export const doneWithErrorMessage = "Unable to complete upload.";
export const doneWithCancelledMessage = "Upload cancelled.";

const styles = theme => ({
  paper: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
    top: "20%",
    left: "20%",
    width: "60%",
    height: "70vh",
    display: "flex",
    flexDirection: "column"
  },
  headingArea: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: "20px",
    marginBottom: "10px",
  },
  textArea: {
    display: "flex",
    flexDirection: "column-reverse", // to autoscroll to end
    height: "100%",
    overflowX: "none",
    overflowY: "auto",
    border: "2px lightgrey solid",
    margin: "16px"
  },
  text: {
    fontSize: "13px",
    lineHeight: "normal",
    margin: "6px",
    wordBreak: "break-all",
  },
  buttonArea: {
    marginRight: "16px",
    alignSelf: "flex-end",
  }
});


export class UploadLogView extends Component {

  handleClose = () => {
    return this.props.clearUploadLog();
  }

  handleCancel = () => {
    return this.props.cancelUpload();
  }


  render() {

    const { uploadLog, classes } = this.props;
    const logLines = uploadLog ? uploadLog.split("\n") : [];
    let i=0;
    const logLinesHtml = logLines.map((line) => (
      <Typography className={ classes.text }
          key={ i++ }>
        { line }
      </Typography>
    ));

    // hack because we do not have a async action with proper redux states for uploading yet
    const uploadFinished = uploadLog && (
      uploadLog.includes(doneMessage) || uploadLog.includes(doneWithErrorMessage)
      || uploadLog.includes(doneWithCancelledMessage));

    return (
      <Modal open={ Boolean(uploadLog) }
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          disableBackdropClick={ true }
          onClose={ this.handleClose }>
        <div className={ classes.paper }>
          <div  className={ classes.headingArea }>
          <Typography variant="h6"
              id="modal-title">
            Poi upload
          </Typography>
          {uploadFinished ? null :
            <CircularProgress className={ classes.progress } />
          }
          </div>
          <div className={ classes.textArea }>
            <div variant="body2"
                id="simple-modal-description">
              { logLinesHtml }
            </div>
          </div>
          <div className={ classes.buttonArea }>
            <Button disabled={ uploadFinished }
                onClick={ this.handleCancel }>Cancel upload</Button>
            <Button disabled={ !uploadFinished }
                onClick={ this.handleClose }>Close</Button>
          </div>
        </div>
      </Modal>
      );
  }
}

UploadLogView.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  uploadLog: PropTypes.string,
  clearUploadLog: PropTypes.func.isRequired,
  cancelUpload: PropTypes.func.isRequired,
};

export default withStyles(styles, {
  withTheme: true
})(UploadLogView);
