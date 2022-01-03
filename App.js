import React from "react";
import { Player } from "./ui/player.js";
import { BottomMenu } from "./ui/bottomMenu.js";
import { Home } from "./page/home.js";
import { Search } from "./page/search.js";
import { My } from "./page/my.js";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import api from "./api";

const pages = [<Home></Home>, <Search></Search>, <My></My>];

export default class App extends React.Component {
  state = {
    currentPage: 0,
  };

  // componentDidMount() {
  //   if (!this.sound) {
  //     this.loadAudio("2qd4cLpENPf0gBia8WFi0m").then(() => {
  //       console.log("loaded");
  //       this.sound.playAsync();
  //     });
  //     console.log(sound);
  //   }
  // }

  getSound = async () => {
    return this.state.sound;
  };

  setPage = (page) => {
    this.setState({ currentPage: page });
  };

  render() {
    return (
      <SafeAreaView style={styles.ParentContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#262626" />
        {pages[this.state.currentPage]}

        <View style={styles.Container}>
          <Player></Player>
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
