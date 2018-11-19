import extractPeaks from 'webaudio-peaks';
import LoaderFactory from '../loader/LoaderFactory'

import {
    LOAD_AUDIO_STARTED, 
    LOAD_AUDIO_FAILURE, 
    LOAD_AUDIO_SUCCESS,
    PLAY_AUDIO,
    STOP_AUDIO,
    } from './types';

// load audio async action

const loadAudioStarted = startInfo => ({
    type: LOAD_AUDIO_STARTED,
    payload: startInfo
});


const loadAudioSuccess = audioInfo => ({
    type: LOAD_AUDIO_SUCCESS,
    payload: audioInfo
});

const loadAudioFailure = errorInfo => ({
    type: LOAD_AUDIO_FAILURE, 
    payload: errorInfo
});

function loadAudioFromFile(audioSource, audioContext) {
    const loader = LoaderFactory.createLoader(audioSource, audioContext);
    return loader.load();
};

export const loadMultipleAudio = (({audioSources, audioContext}) =>
    audioSources.map((audioSource) => loadAudio(audioSource, audioContext)));

export const loadAudio = ({audioSource, audioContext}) => {
    return dispatch => {
        dispatch(loadAudioStarted({audioSource}));

        loadAudioFromFile(audioSource, audioContext)
        .then(audioBuffer => {
                const peaks = extractPeaks(audioBuffer, 1000, true, 0, audioBuffer.length, 16);
                dispatch(loadAudioSuccess({audioSource, audioBuffer, peaks}));
        })
        .catch(err => {
            dispatch(loadAudioFailure({audioSource, err}));
        });
    };
};

export const playAudio = () => ({
    type: PLAY_AUDIO
});

export const stopAudio = () => ({
    type: STOP_AUDIO
});
