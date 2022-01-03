import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { Component } from "react/cjs/react.production.min";
import api from "../api";

class Item extends Component {
  render() {
    return (
      <View style={styles.Content}>
        <Image
          style={{ width: 50, height: 50, borderRadius: 5 }}
          source={{
            uri: this.props.image,
          }}
        ></Image>
        <View style={styles.Details}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              color: "#fff",
            }}
            numberOfLines={1}
          >
            {this.props.title}
          </Text>
          <Text style={{ color: "#fff" }} numberOfLines={1}>
            {this.props.description}
          </Text>
        </View>
      </View>
    );
  }
}

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
    if (!this.state.query) {
      return;
    }
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
      })
      .catch((err) => {
        console.log("[Search]", "Failed", this.state.query);
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
      <View style={{ height: "100%" }}>
        <View style={styles.Header}>
          <Text style={{ fontWeight: "bold", fontSize: 25, color: "#fff" }}>
            Search
          </Text>
          <TextInput
            style={styles.SearchBar}
            onChangeText={this.onQueryChange}
            value={this.state.query}
            placeholder="Search Artist, Song Or An Album"
          />
        </View>
        <View style={{ height: "70%" }}>
          <ScrollView contentContainerStyle={styles.Main}>
            {this.state.total.length > 0 && (
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  color: "#fff",
                  alignSelf: "flex-start",
                  margin: 10,
                  marginTop: 5,
                }}
              >
                Top Results
              </Text>
            )}
            {this.state.total.map((item) => {
              if (item.type == "artist") {
                return (
                  <Item
                    key={item.id}
                    title={item.name}
                    image={
                      item.avatar.length > 0
                        ? item.avatar[0].url
                        : "https://media.istockphoto.com/vectors/people-icon-person-icon-user-icon-in-trendy-flat-style-isolated-on-vector-id1166184350?k=20&m=1166184350&s=170667a&w=0&h=-OcfPNeTuiR5dJNM6ahYx3PgxevGi00akHF1J_Dq-rA="
                    }
                    description={`Artist`}
                  />
                );
              } else if (item.type == "album") {
                return (
                  <Item
                    key={item.id}
                    title={item.name}
                    image={item.cover[0].url}
                    description={`Album • ${item.artists
                      .map((artist) => artist.name)
                      .join(", ")}`}
                  />
                );
              } else if (item.type == "playlist") {
                return (
                  <Item
                    key={item.id}
                    title={item.name}
                    image={item.cover[0].url}
                    description={`Playlist`}
                  />
                );
              } else if (item.type == "track") {
                return (
                  <Item
                    key={item.id}
                    title={item.name}
                    image={item.album.cover[0].url}
                    description={`Song • ${item.artists
                      .map((artist) => artist.name)
                      .join(", ")}`}
                  />
                );
              }
            })}
            {this.state.total.length > 0 && (
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  color: "#fff",
                  alignSelf: "flex-start",
                  margin: 10,
                  marginTop: 5,
                }}
              >
                Songs
              </Text>
            )}
            {this.state.songs.map((item) => {
              return (
                <Item
                  key={item.id}
                  title={item.name}
                  image={item.album.cover[0].url}
                  description={`Song • ${item.artists
                    .map((artist) => artist.name)
                    .join(", ")}`}
                />
              );
            })}
            <View style={{ height: 100 }}></View>
          </ScrollView>
        </View>
      </View>
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
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 25,
    paddingLeft: 12,
    paddingRight: 12,
    height: 150,
    paddingBottom: 0,
  },
  Content: {
    width: "100%",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  Details: {
    marginLeft: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  SearchBar: {
    height: 40,
    margin: 10,
    width: "99%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignSelf: "center",
  },
});
