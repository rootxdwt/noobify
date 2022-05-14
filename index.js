import { AppRegistry } from "react-native";
import TrackPlayer from "react-native-track-player";
import App from "./App";

AppRegistry.registerComponent("main", () => App);
TrackPlayer.registerPlaybackService(() => require("./playbackService"));
