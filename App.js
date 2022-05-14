import React from "react";
import { Player } from "./ui/player.js";
import { BottomMenu } from "./ui/bottomMenu.js";
import { Home } from "./page/home.js";
import { Search } from "./page/search.js";
import { Playlist } from "./page/playlist.js";
import { My } from "./page/my.js";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Audio } from "expo-av";
import audioLibrary from "./audio";
import TrackPlayer from "react-native-track-player";

const pages = [<Home></Home>, <Search></Search>, <My></My>];

export default class App extends React.Component {
  state = {
    currentPage: 0,
    playlist: null,
    playlistType: "",
  };
  constructor(props) {
    super(props);
    this.prevPage = [];
  }

  async componentDidMount() {
    // const sound = audioLibrary.getSound();
    console.log("noob");
    try {
      console.log(TrackPlayer.setupPlayer.call(this));
    } catch {
      // await TrackPlayer.setupPlayer();
    }
    if (sound === null) {
      console.log("[App]", "No sound found");
      audioLibrary.setSound(new Audio.Sound());
      audioLibrary.setQueue([]);
    } else {
      console.log("[App]", "Sound already registered");
    }
  }

  getSound = async () => {
    return this.state.sound;
  };

  setPage = (page) => {
    this.setState({ currentPage: page, playlist: null });
  };

  showPlaylist = (id, type) => {
    this.setState({ playlist: id, playlistType: type });
    console.log(type);
  };

  render() {
    return (
      <SafeAreaView style={styles.ParentContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#262626" />
        {this.state.playlist ? (
          <Playlist
            id={this.state.playlist}
            prevFunc={() => {
              this.setPage(0);
            }}
            type={this.state.playlistType}
          ></Playlist>
        ) : (
          React.cloneElement(pages[this.state.currentPage], {
            showPlaylist: this.showPlaylist,
          })
        )}

        <View style={styles.Container}>
          <Player currentPlayingType={this.state.playlistType}></Player>
          <BottomMenu setPage={this.setPage}></BottomMenu>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  ParentContainer: {
    backgroundColor: "#262626",
    height: "100%",
  },
  Container: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    backgroundColor: "#262626",
    alignItems: "center",
    width: "100%",
  },
});
