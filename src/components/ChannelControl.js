import React, { Component } from 'react';
import styled /*, { withTheme } */ from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip, IconButton, Typography, FormControl, InputLabel, Select, MenuItem, } from '@material-ui/core';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteChannelIcon from '@material-ui/icons/DeleteSweep';
import DownloadConfigIcon from '@material-ui/icons/GetApp';
import UploadConfigIcon from '@material-ui/icons/Publish';
import UploadAudioChannelIcon from '@material-ui/icons/QueueMusic';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import DownloadChannelIcon from '@material-ui/icons/LowPriority';
import RestoreImagesIcon from '@material-ui/icons/CloudDownload';
import SaveImagesIcon from '@material-ui/icons/CloudUpload';
import ClearStoreIcon from '@material-ui/icons/CloudOff';
import ClearImagesIcon from '@material-ui/icons/Clear';

const ChannelControlWrapper = styled.div`
  display: flex
  justify-content: center;
  flex-direction: row;
  margin: 0;
  padding: 0 20px;
`;

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});


export class ChannelControl extends Component {
  
  constructor(props) {
    super(props);
    this.selectedChannelId = null;
    this.state = {
      age: '',
      name: 'hai',
      labelWidth: 0,
    };
  }

  uploadConfigFile = (evt) => {
    evt.preventDefault();
    this.props.uploadConfigFile(evt.target.files[0]);
  };

  uploadAudioFile = (evt) => {
    evt.preventDefault();
    this.props.uploadAudioFile(evt.target.files[0]);
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {

    const { classes } = this.props;

    const channelSelection = this.props.channelIds.map((channelId) => 
      <option key={channelId} value={channelId}>{channelId}</option>
    )

    const channelSelection2 = this.props.channelIds.map((channelId) => 
    <MenuItem key={channelId} value={channelId}>{channelId}</MenuItem>
    )


    if (this.selectedChannelId) {
      if (this.props.channelIds && !this.props.channelIds.includes(this.selectedChannelId)){
        this.selectedChannelId = this.props.channelIds[0];
      }
    } else {
      this.selectedChannelId =this.props.channelIds ? this.props.channelIds[0] : null;
    }

    return (
      <ChannelControlWrapper>
          <input 
            type="file" 
            accept="audio/*"
            hidden 
            ref={(fileUpload) => this.fileUpload = fileUpload }
            onChange={this.uploadAudioFile} width={0} 
          />
          <Tooltip title="Load audio">
            <IconButton  color="inherit" onClick={() => this.fileUpload.click()}>
              <UploadAudioChannelIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add image channel">
            <IconButton color="inherit" onClick={ this.props.addImageChannel }>
              <PlaylistAddIcon/>
            </IconButton>
          </Tooltip>

          <FormControl className={classes.formControl}>
          <InputLabel htmlFor="age-simple">Channel</InputLabel>
          <Select
            value={this.state.age}
            onChange={this.handleChange}
            inputProps={{
              name: 'age',
              id: 'age-simple',
            }}
          >
           { channelSelection2 }
          </Select>
        </FormControl>

          <select 
            onChange={(e) => this.selectedChannelId= e.target.value}>
            {channelSelection}
          </select>

          <Tooltip title="Export image channel">
            <IconButton color="inherit" onClick={ () => this.props.exportImageChannel(this.selectedChannelId) }>
              <DownloadChannelIcon/>
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete image channel">
            <IconButton color="inherit" onClick={ () => this.props.deleteChannel(this.selectedChannelId) }>
              <DeleteChannelIcon/>
            </IconButton>
          </Tooltip>


          <Tooltip title="Download show">
            <IconButton color="inherit" onClick={ this.props.downloadConfig }>
              <DownloadConfigIcon/>
            </IconButton>
          </Tooltip>

          <input 
            type="file" 
            hidden 
            ref={(showUpload) => this.showUpload = showUpload }
            onChange={this.uploadConfigFile} width={0} 
          />
          <Tooltip title="Load show">
            <IconButton  color="inherit" onClick={() => this.showUpload.click()}>
              <UploadConfigIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Save images to store">
            <IconButton color="inherit" onClick={ this.props.saveImagesToStorage }>
              <SaveImagesIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Restore images from store">
            <IconButton color="inherit" onClick={ this.props.loadImagesfromStorage }>
              <RestoreImagesIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear store">
            <IconButton color="inherit" onClick={ this.props.clearImagesfromStorage }>
              <ClearStoreIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear images">
            <IconButton color="inherit" onClick={ this.props.clearImageList }>
              <ClearImagesIcon/>
            </IconButton>
          </Tooltip>

        <Tooltip title="Play">
          <IconButton color="inherit" onClick={ this.props.playChannel }>
            <PlayArrowIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Stop">
          <IconButton color="inherit" onClick={ this.props.stopChannel }>
            <StopIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete selected">
          <IconButton color="inherit" onClick={ this.props.deleteSelectedPart }>
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom in">
          <IconButton color="inherit" onClick={ this.props.zoomIn }>
            <ZoomInIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom out">
          <IconButton color="inherit" onClick={ this.props.zoomOut }>
            <ZoomOutIcon/>
          </IconButton>
        </Tooltip>
      </ChannelControlWrapper>
      );
  }
}

export default withStyles(styles, {
  withTheme: true
})(ChannelControl);

/*
        <select onChange={ this.props.setMode }>
          <option value="moveMode">Move mode</option>
          <option value="selectionMode">Selection mode</option>
        </select>
        */

// export const ChannelControlWithTheme = withTheme(ChannelControl);