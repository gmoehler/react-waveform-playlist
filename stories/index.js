import React from 'react';
import { ThemeProvider } from 'styled-components';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Channel from '../src/components/Channel';
import ImageChannel from '../src/components/ImageChannel';
import TimeScale from '../src/components/TimeScale';
import TrackControls from '../src/components/TrackControls';
import BBCWaveformData from '../public/media/json/vocals.json';
import imageFile from '../public/media/image/mostlyStripes.png';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeDown } from '@fortawesome/free-solid-svg-icons';

library.add(faVolumeUp);
library.add(faVolumeDown);

const {
  sample_rate: sampleRate,
  samples_per_pixel: samplesPerPixel,
  bits,
  length,
  data
} = BBCWaveformData;

const theme = {
  waveOutlineColor: 'green',
  waveFillColor: 'white',
  waveProgressColor: 'transparent',
  waveProgressBorderColor: 'purple',
  imageBackgroundColor: 'black',
  cursorColor: 'red',
  selectionColor: 'rgba(0,0,255,0.5)',
  timeColor: 'red',
};

const image = {
  src: imageFile,
  alt: 'my image',
};


const scale = window.devicePixelRatio;

storiesOf('Channel', module)
  .add('Default Values.', () => (
    <Channel></Channel>
  ))
  .add('BBC Waveform Peaks.', () => (
    <Channel peaks={data} length={length} bits={bits}></Channel>
  ))
  .add('BBC Waveform Peaks & devicePixelRatio.', () => (
    <Channel peaks={data} length={length} bits={bits} scale={scale}></Channel>
  ))
  .add('BBC Waveform Peaks & devicePixelRatio & progress.', () => (
    <Channel peaks={data} length={length} bits={bits} scale={scale} progress={100}></Channel>
  ))
  .add('BBC Waveform Peaks & devicePixelRatio & theming.', () => (
    <ThemeProvider theme={theme}>
      <Channel peaks={data} length={length} bits={bits} scale={scale}></Channel>
    </ThemeProvider>
  ))
  .add('BBC Waveform Peaks & devicePixelRatio & theming & progress.', () => (
    <ThemeProvider theme={theme}>
      <Channel peaks={data} length={length} bits={bits} scale={scale} progress={100}></Channel>
    </ThemeProvider>
  ))
  .add('BBC Waveform Peaks & devicePixelRatio & theming & custom waveform height.', () => (
    <ThemeProvider theme={theme}>
      <Channel peaks={data} length={length} bits={bits} scale={scale} waveHeight={65}></Channel>
    </ThemeProvider>
  ))
  .add('BBC Waveform Peaks & devicePixelRatio & theming & cursor position.', () => (
    <ThemeProvider theme={theme}>
      <Channel peaks={data} length={length} bits={bits} scale={scale} cursorPos={100}></Channel>
    </ThemeProvider>
    ))
  .add('BBC Waveform Peaks & devicePixelRatio & theming & progress & cursor position.', () => (
    <ThemeProvider theme={theme}>
      <Channel peaks={data} length={length} bits={bits} scale={scale} progress={200} cursorPos={100}></Channel>
    </ThemeProvider>
  ))
  .add('BBC Waveform Peaks & devicePixelRatio & theming & selection.', () => (
    <ThemeProvider theme={theme}>
      <Channel peaks={data} length={length} bits={bits} scale={scale} progress={200} 
        selection={{from: 300, to: 450}}>
      </Channel>
    </ThemeProvider>
  ))
  .add('BBC Waveform Peaks & devicePixelRatio & theming & selection and start.', () => (
    <ThemeProvider theme={theme}>
      <Channel peaks={data} length={length} bits={bits} scale={scale} 
        progress={200} start={150}
        selection={{from: 300, to: 450}}>
      </Channel>
    </ThemeProvider>
  ))
  ;
  
  storiesOf('ImageChannel', module)
  .add('Image channel.', () => (
      <ImageChannel></ImageChannel>
  ))
  .add('Image channel with image and factor 5.', () => (
      <ImageChannel source={image.src} length={length} factor={5}> </ImageChannel>
  ))
  .add('Image channel with image and factor 5 & progress.', () => (
    <ImageChannel source={image.src} length={length} factor={5} scale={scale} progress={200}> </ImageChannel>
  ))
  .add('Image channel with image and factor 5 & cursor.', () => (
    <ImageChannel source={image.src} length={length} factor={5} scale={scale} cursorPos={150}> </ImageChannel>
  ))
  .add('Image channel with image and factor 5 & selection.', () => (
    <ImageChannel source={image.src} length={length} factor={5} scale={scale} selection={{from: 300, to: 450}} > </ImageChannel>
  ))
  .add('Image channel with image and factor 5 & cursor, progress & selection.', () => (
    <ImageChannel 
    source={image.src} length={length} factor={5} scale={scale} 
    progress={200} cursorPos={150} selection={{from: 300, to: 450}} > 
    </ImageChannel>
  ))
  .add('Image channel with image and factor 5 & cursor, progress & selection & start.', () => (
    <ImageChannel 
    source={image.src} length={length} factor={5} scale={scale} 
    progress={200} cursorPos={150} selection={{from: 300, to: 450}} 
    start={150}> 
    </ImageChannel>
  ))

  ;

storiesOf('TimeScale', module)
  .add('Default Values.', () => (
    <TimeScale></TimeScale>
  ))
  .add('30s duration + device scale.', () => (
    <TimeScale duration={30} scale={scale}></TimeScale>
  ))
  .add('60s duration + 100 controlWidth + device scale.', () => (
    <TimeScale duration={30} controlWidth={100} scale={scale}></TimeScale>
  ))
  .add('60s duration at 3000 samplesPerPixel, 48000 sampleRate, 0 controlWidth + device scale.', () => (
    <TimeScale duration={60} samplesPerPixel={3000} scale={scale}></TimeScale>
  ))
  .add('30s duration + theme + device scale.', () => (
    <ThemeProvider theme={theme}>
      <TimeScale duration={30} scale={scale}></TimeScale>
    </ThemeProvider>
  ));

storiesOf('TrackControls', module)
  .add('Default Values.', () => (
    <TrackControls></TrackControls>
  ));
