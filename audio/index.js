import { Audio } from "expo-av";

let sound = null;
let queues = [];
let caches = {};
let isPlaying = false;
let loopingMode = "none";
let currentIndex = 0;

// Handlers
let queueUpdateRecivers = [];
let statusUpdateRecivers = [];

const checkAvailable = async (id) => {
  if (caches[id]) {
    return caches[id];
  }
  const result = await api.get(`/song/${id}/audio`);
  const available = result.headers["content-type"].includes("audio/mpeg");
  caches[id] = available;
  return available;
};

const _playbackStatusUpdate = async (status) => {
  statusUpdateRecivers.forEach((reciever) => reciever(status));
  if (status.didJustFinish) {
    if (loopingMode === "none") {
      currentIndex++;
      if (currentIndex >= queues.length) {
        currentIndex--;
        await stopPlaying();
      } else {
        await _loadAudio(queues[currentIndex]);
        await sound.playAsync();
      }
    } else if (loopingMode === "all") {
      currentIndex++;
      if (currentIndex >= queues.length) {
        currentIndex = 0;
      }
      await _loadAudio(queues[currentIndex]);
      await sound.playAsync();
    } else if (loopingMode === "one") {
      await _loadAudio(queues[currentIndex]);
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

const setPlaying = async (playing) => {
  isPlaying = playing;
  if (playing) {
    await sound.playAsync();
  } else {
    await sound.pauseAsync();
  }
};

const stopPlaying = async () => {
  await sound.stopAsync();
};

const _loadAudio = async (id) => {
  if (!(await checkAvailable(id))) {
    queues = queues.filter((q) => q !== id);
    return false;
  }
  await Audio.setAudioModeAsync({
    staysActiveInBackground: true,
  });
  await sound.loadAsync(
    {
      uri: `https://api.noobify.workers.dev/song/${id}/audio`,
    },
    {},
    false
  );
  return true;
};

const setQueue = (newQueue) => {
  queues = newQueue;
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
  await _loadAudio(queues[currentIndex]);
};

const back = async () => {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex++;
    throw Error(
      "You can't skip to the previous song, there is no previous song"
    );
  }
  await _loadAudio(queues[currentIndex]);
};

const getIndex = () => {
  return currentIndex;
};

const setPosition = async (position) => {
  await sound.setPositionAsync(position);
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

exports = {
  getSound,
  setSound,
  getPlaying,
  setPlaying,
  stopPlaying,
  getQueue,
  setQueue,
  skip,
  back,
  getIndex,
  setPosition,
  registerQueueUpdateReciver,
  registerStatusUpdateReciver,
  setLoopingMode,
  getLoopingMode,
};
