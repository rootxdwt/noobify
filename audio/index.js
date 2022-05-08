import { Audio } from "expo-av";
import api from "../api";

let sound = null;
let queues = [];
let caches = {};
let isPlaying = false;
let loopingMode = "none";
let currentIndex = 0;
let playingAudioFullDuration = 0;
let loaded = false;

// Handlers
let queueUpdateRecivers = [];
let statusUpdateRecivers = [];

const checkAvailable = async (id) => {
  if (caches[id]) {
    return caches[id];
  }
  var resp = await api.get(`/song/${id}/available`);
  var tf = resp.data.available;
  return tf;
};

const _playbackStatusUpdate = async (status) => {
  statusUpdateRecivers.forEach((reciever) => reciever(status));
  if (status.didJustFinish) {
    if (loaded) {
      await _unloadAudio();
    }
    if (loopingMode === "none") {
      currentIndex++;
      if (currentIndex >= queues.length) {
        currentIndex--;
      } else {
        await _loadAudio(queues[currentIndex].id);
        await sound.playAsync();
      }
    } else if (loopingMode === "all") {
      currentIndex++;
      if (currentIndex >= queues.length) {
        currentIndex = 0;
      }
      await _loadAudio(queues[currentIndex].id);
      await sound.playAsync();
    } else if (loopingMode === "one") {
      await _loadAudio(queues[currentIndex].id);
      await sound.playAsync();
    }
  }
};

const getSound = () => {
  return sound;
};

const setSound = (newSound) => {
  if (sound !== null) {
    return;
  } else console.log("[Sound]", "Setting new sound");
  sound = newSound;
  sound.setOnPlaybackStatusUpdate(_playbackStatusUpdate);
};

const getPlaying = () => {
  return isPlaying;
};

const appendQueue = (queue) => {
  queues.push(queue);
  queueUpdateRecivers.forEach((reciever) => reciever(queues));
};

const setPlaying = async (playing) => {
  isPlaying = playing;
  if (playing) {
    if (queues.length === 0) {
      throw new Error("No queues to play");
    }
    if (loaded === false) {
      await _loadAudio(queues[currentIndex].id);
    }
    console.log("[Sound]", "Playing");
    await sound.playAsync();
  } else {
    console.log("[Sound]", "Pausing");
    await sound.pauseAsync();
  }
};

const stopPlaying = async () => {
  console.log("[Sound]", "Stopping");
  await sound.stopAsync();
  playing = false;
};

const audioFullDuration = () => {
  return playingAudioFullDuration;
};

const _loadAudio = async (id) => {
  loaded = true;
  const isAvailable = await checkAvailable(id);
  console.log("[Sound]", "Checking", id);
  if (isAvailable == false) {
    console.log("[Sound]", "Song is not available");
    queues = queues.filter((q) => q.id !== id);
    queueUpdateRecivers.forEach((reciever) => reciever(queues));
    if (queues.length <= currentIndex) {
      throw new Error("No queues to play");
    }
    return _loadAudio(queues[currentIndex].id);
  }

  //for ios
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

  //UNCOMMENT BELOW ON PRODUCTION

  /*
  await Audio.setAudioModeAsync({
    staysActiveInBackground: true,
  });
  */

  //UNCOMMENT ABOVE ON PRODUCTION

  var resp = await api.get(`/song/${id}/`);
  playingAudioFullDuration = resp.data.duration;
  console.log("[Sound]", "Loading", id);
  await sound.loadAsync(
    {
      uri: `https://api.noobify.workers.dev/song/${id}/audio`,
    },
    {},
    false
  );
  return true;
};

const _unloadAudio = async () => {
  loaded = false;
  console.log("[Sound]", "Unloading");
  await sound.unloadAsync();
};

const setQueue = async (newQueue) => {
  console.log("[Sound]", "Setting new queue");
  if (loaded) {
    await _unloadAudio();
  }
  queues = newQueue;
  queueUpdateRecivers.forEach((reciever) => reciever(queues));
};

const getQueue = () => {
  return queues;
};

const skip = async () => {
  currentIndex++;
  if (currentIndex >= queues.length) {
    currentIndex--;
    throw Error("You can't skip to the next song, there is no next song");
  }
  if (loaded) {
    await _unloadAudio();
  }
  await _loadAudio(queues[currentIndex].id);
  await sound.playAsync();
};


const back = async () => {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex++;
    throw Error(
      "You can't skip to the previous song, there is no previous song"
    );
  }
  if (loaded) {
    await _unloadAudio();
  }
  await _loadAudio(queues[currentIndex].id);
  await sound.playAsync();
};

const getIndex = () => {
  return currentIndex;
};

const setIndex = async (value) => {
  if (loaded) {
    await _unloadAudio();
  }
  currentIndex = value;
};

const setPosition = async (position) => {
  try {
    await sound.setPositionAsync(position, {
      toleranceMillisBefore: 0,
      toleranceMillisAfter: 0,
    });
  } catch (e) {
    console.log(e)
  }
};

const getLoopingMode = () => {
  return loopingMode;
};

const setLoopingMode = (mode) => {
  loopingMode = mode;
};

const registerQueueUpdateReciver = (reciever) => {
  queueUpdateRecivers.push(reciever);
};

const registerStatusUpdateReciver = (reciever) => {
  statusUpdateRecivers.push(reciever);
};

const unregisterQueueUpdateReciver = (reciever) => {
  queueUpdateRecivers = queueUpdateRecivers.filter((r) => r !== reciever);
};

const unregisterStatusUpdateReciver = (reciever) => {
  statusUpdateRecivers = statusUpdateRecivers.filter((r) => r !== reciever);
};

module.exports = {
  getSound,
  setSound,
  getPlaying,
  setPlaying,
  stopPlaying,
  setQueue,
  getQueue,
  skip,
  back,
  getIndex,
  setPosition,
  registerQueueUpdateReciver,
  registerStatusUpdateReciver,
  unregisterQueueUpdateReciver,
  unregisterStatusUpdateReciver,
  setLoopingMode,
  getLoopingMode,
  checkAvailable,
  appendQueue,
  setIndex,
  audioFullDuration,
  changeProgress,
};

console.log("[Sound]", "Initialized sound");
