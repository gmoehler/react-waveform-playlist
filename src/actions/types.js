// action type constants

// general actions
export const LOAD_SHOW_STARTED = "LOAD_SHOW_STARTED";
export const LOAD_SHOW_SUCCESS = "LOAD_SHOW_SUCCESS";
export const LOAD_SHOW_FAILURE = "LOAD_SHOW_FAILURE";

// channel actions
export const ADD_A_CHANNEL = "ADD_A_CHANNEL";
export const DELETE_A_CHANNEL = "DELETE_A_CHANNEL";
export const CLEAR_ALL_CHANNELS = "CLEAR_ALL_CHANNELS";
export const SET_A_CHANNEL_ACTIVE = "SET_A_CHANNEL_ACTIVE";
export const SET_A_CHANNEL_INACTIVE = "SET_A_CHANNEL_INACTIVE";
export const PLAY_THE_CHANNELS = "PLAY_THE_CHANNELS";
export const STOP_A_CHANNEL = "STOP_A_CHANNEL";
export const STOP_ALL_CHANNELS = "STOP_ALL_CHANNELS";

export const ADD_CHANNEL = "ADD_CHANNEL";
export const DELETE_CHANNEL = "DELETE_CHANNEL";
export const CLEAR_CHANNELS = "CLEAR_CHANNELS";
export const SET_CHANNEL_ACTIVE = "SET_CHANNEL_ACTIVE";
export const UNSET_CHANNEL_ACTIVE = "UNSET_CHANNEL_ACTIVE";
export const UPDATE_CHANNEL = "UPDATE_CHANNEL";

export const LOAD_AUDIO_STARTED = "LOAD_AUDIO_STARTED";
export const LOAD_AUDIO_SUCCESS = "LOAD_AUDIO_SUCCESS";
export const LOAD_AUDIO_FAILURE = "LOAD_AUDIO_FAILURE";

export const PLAY_CHANNELS = "PLAY_CHANNELS";
export const STOP_CHANNELS = "STOP_CHANNELS";

// general entity actions
export const SELECT_ENTITY = "SELECT_ENTITY";
export const DESELECT_ENTITY = "DESELECT_ENTITY";
export const CLEAR_ENTITY_SELECTION = "CLEAR_ENTITY_SELECTION";

// image list actions
export const CLEAR_IMAGELIST = "CLEAR_IMAGELIST";
export const ADD_IMAGE = "ADD_IMAGE";
export const REMOVE_IMAGE = "REMOVE_IMAGE";

// part actions
export const CLEAR_PARTS = "CLEAR_PARTS";
export const ADD_A_PART = "ADD_A_PART";
export const DELETE_A_PART = "DELETE_A_PART";
export const MOVE_A_PART = "MOVE_A_PART";
export const RESIZE_A_PART = "RESIZE_A_PART";

// marker actions
export const CLEAR_MARKERS = "CLEAR_MARKERS";
export const SET_OR_REPLACE_A_MARKER = "SET_OR_REPLACE_A_MARKER";
export const DELETE_A_MARKER = "DELETE_A_MARKER";
export const UPDATE_A_MARKER = "UPDATE_A_MARKER";

// view actions
export const CLEAR_VIEW = "CLEAR_VIEW";
export const SELECT_RANGE = "SELECT_RANGE";
export const DESELECT_RANGE = "DESELECT_RANGE";
export const SET_RESOLUTION = "SET_RESOLUTION";
export const SET_CHANNEL_PLAY_STATE = "SET_CHANNEL_PLAY_STATE";

export const COPY_PART = "COPY_PART";
export const SELECT_IMAGE_CHANNEL = "SELECT_IMAGE_CHANNEL";
export const ADD_TO_UPLOAD_LOG = "ADD_TO_UPLOAD_LOG";
export const CLEAR_UPLOAD_LOG = "CLEAR_UPLOAD_LOG";
export const SET_MESSAGE = "SET_MESSAGE";
export const CLEAR_MESSAGE = "CLEAR_MESSAGE";