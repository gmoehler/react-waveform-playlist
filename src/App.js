import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadAudio } from './actions/audioActions'

import Channel from './components/Channel';

import logo from './logo.svg';
import './App.css';

const scale = window.devicePixelRatio;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new window.AudioContext();

class App extends Component {

  loadAudioAction = (event) => {
    this.props.loadAudioAction({
      audioSource: "media/audio/Vocals30.mp3", 
      audioContext
    });
  }


  render() {

    const {
      bits,
      length,
      data
    } = {...this.props.audio.peaks};
    const channelData = Array.isArray(data) ? data[0] : [];

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
           Waveform demo
          </p>

          <button onClick={this.loadAudioAction}>Load audio</button>
          <Channel peaks={channelData} length={length} bits={bits} scale={scale}></Channel>

        </header>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
 });

 const mapDispatchToProps = dispatch => ({
    loadAudioAction: spec => dispatch(loadAudio(spec))
 })


 export default connect(mapStateToProps, mapDispatchToProps)(App);
