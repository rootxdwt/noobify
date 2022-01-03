import { StyleSheet, View, Text, TextInput, ScrollView } from "react-native";
import { Component } from "react/cjs/react.production.min";
import api from "../api";

export class Search extends Component {
  state = {
    query: "",
    total: [],
    artists: [],
    albums: [],
    playlists: [],
    songs: [],
  };
  lastTyping = 0;

  requsetSearch = async () => {
    api
      .post("/search", { query: this.state.query })
      .then(({ data: { total, artists, album, playlists, songs } }) => {
        console.log("[Search]", "Fetched");
        this.setState({
          total,
          artists,
          albums: album,
          playlists,
          songs,
        });
      });
  };

  onQueryChange = (text) => {
    this.setState({ query: text });
    if (text == "") {
      this.setState({
        total: [],
        artists: [],
        albums: [],
        playlists: [],
        songs: [],
      });
    } else {
      this.lastTyping = Date.now();
      setTimeout(() => {
        if (Date.now() - this.lastTyping > 500) {
          this.lastTyping = Date.now();
          if (text !== "") {
            console.log("[Search]", "Requesting");
            this.requsetSearch();
          }
        }
      }, 500);
    }
  };

  render() {
    return (
      <>
        <View style={styles.Header}>
          <Text style={{ fontWeight: "bold", fontSize: 25, color: "#fff" }}>
            Search
          </Text>
          <TextInput
            style={styles.SearchBar}
            onChangeText={this.onQueryChange}
          />
        </View>
        <ScrollView contentContainerStyle={styles.Main}></ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  Main: {
    marginLeft: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  Header: {
    marginTop: 60,
    width: "100%",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 25,
    paddingLeft: 12,
    paddingRight: 12,
  },
  SearchBar: {
    height: 40,
    margin: 10,
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignSelf: "center",
  },
});
