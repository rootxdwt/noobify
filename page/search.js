import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { Component } from "react/cjs/react.production.min";
import api from "../api";
import audioLibrary from "../audio";

class Item extends Component {
  onPress = async () => {
    const { id } = this.props.data;
    console.log("[Item]", this.props.type, id);
    if (this.props.type === "playlist" || this.props.type === "album") {
      this.props.showPlaylist("Playlist", { id: id, type: this.props.type });
    } else {
      const available = true;

      if (available) {
        const recommendations = await api.get(`/song/${id}/recommendations`);
        const newQueue = [this.props.data, ...recommendations.data];
        await audioLibrary.setQueue(newQueue);
        await audioLibrary.setIndex(0);
        await audioLibrary.setPlaying(true);
      }
    }
  };

  render() {
    return (
      <Pressable
        onPress={this.onPress}
        style={{
          alignSelf: "flex-start",
          width: "100%",
        }}
      >
        <View style={styles.Content}>
          <View style={{ backgroundColor: "#363636", borderRadius: 5 }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 5 }}
              source={{
                uri: this.props.image,
              }}
            ></Image>
          </View>

          <View style={styles.Details}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                color: "#fff",
                width: "80%"
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {this.props.title}
            </Text>
            <Text style={{ color: "#fff" }} numberOfLines={1}>
              {this.props.description}
            </Text>
          </View>
        </View>
      </Pressable>
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
    isRequesting: false,
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
          isRequesting: false,
        });
      })
      .catch((err) => {
        this.setState({
          isRequesting: false,
        });
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
      this.setState({
        isRequesting: true,
      });
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
      <View style={{ height: "100%", backgroundColor: "#262626" }}>
        <ScrollView
          contentContainerStyle={styles.Main}
          stickyHeaderIndices={[1]}
        >
          <View style={styles.Header}>
            <Text style={{ fontWeight: "bold", fontSize: 25, color: "#fff" }}>
              Search
            </Text>
          </View>
          <View style={{width: "100%", backgroundColor: "#262626"}}>
          <TextInput
              style={styles.SearchBar}
              onChangeText={this.onQueryChange}
              value={this.state.query}
              placeholder="Search Artist, Song Or An Album"
            />
          </View>

          <View style={{ height: 10 }}></View>
          {(this.state.total.length > 0 && (
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
          )) ||
            (this.state.query &&
            !this.state.isRequesting &&
            this.state.query !== "" ? (
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    color: "#fff",
                    alignSelf: "center",
                    margin: 10,
                    marginTop: 5,
                  }}
                >
                  No Results
                </Text>
              </View>
            ) : <>
            <View style={{flex:1, flexDirection: "row", justifyContent: "space-evenly", width: "100%", flexWrap: "wrap"}}>
              
            </View>
            
            </>)}
          {this.state.total.map((item) => {
            if (item.type == "artist") {
              return (
                <Item
                  showPlaylist={this.props.navigation.navigate}
                  key={item.id}
                  title={item.name}
                  image={
                    item.avatar.length > 0
                      ? item.avatar[0].url
                      : "https://media.istockphoto.com/vectors/people-icon-person-icon-user-icon-in-trendy-flat-style-isolated-on-vector-id1166184350?k=20&m=1166184350&s=170667a&w=0&h=-OcfPNeTuiR5dJNM6ahYx3PgxevGi00akHF1J_Dq-rA="
                  }
                  description={`Artist`}
                  type="artist"
                  data={item}
                />
              );
            } else if (item.type == "album") {
              return (
                <Item
                  showPlaylist={this.props.navigation.navigate}
                  key={item.id}
                  title={item.name}
                  image={item.cover[0].url}
                  description={`Album • ${item.artists
                    .map((artist) => artist.name)
                    .join(", ")}`}
                  type="album"
                  data={item}
                />
              );
            } else if (item.type == "playlist") {
              return (
                <Item
                  showPlaylist={this.props.navigation.navigate}
                  key={item.id}
                  title={item.name}
                  image={item.cover[0].url}
                  description={`Playlist`}
                  type="playlist"
                  data={item}
                />
              );
            } else if (item.type == "track") {
              return (
                <Item
                  showPlaylist={this.props.navigation.navigate}
                  key={item.id}
                  title={item.name}
                  image={item.album.cover[0].url}
                  description={`Song • ${item.artists
                    .map((artist) => artist.name)
                    .join(", ")}`}
                  type="song"
                  data={item}
                />
              );
            }
          })}
          {this.state.songs.length > 0 && (
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
                showPlaylist={this.props.navigation.navigate}
                key={item.id}
                title={item.name}
                image={item.album.cover[0].url}
                description={`Song • ${item.artists
                  .map((artist) => artist.name)
                  .join(", ")}`}
                type="song"
                data={item}
              />
            );
          })}
          {this.state.albums.length > 0 && (
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
              Albums
            </Text>
          )}
          {this.state.albums.map((item) => {
            return (
              <Item
                showPlaylist={this.props.navigation.navigate}
                key={item.id}
                title={item.name}
                image={item.cover[0].url}
                description={`Album • ${item.artists
                  .map((artist) => artist.name)
                  .join(", ")}`}
                type="album"
                data={item}
              />
            );
          })}
          {this.state.artists.length > 0 && (
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
              Artists
            </Text>
          )}
          {this.state.artists.map((item) => {
            return (
              <Item
                showPlaylist={this.props.navigation.navigate}
                key={item.id}
                title={item.name}
                image={
                  item.avatar.length > 0
                    ? item.avatar[0].url
                    : "https://media.istockphoto.com/vectors/people-icon-person-icon-user-icon-in-trendy-flat-style-isolated-on-vector-id1166184350?k=20&m=1166184350&s=170667a&w=0&h=-OcfPNeTuiR5dJNM6ahYx3PgxevGi00akHF1J_Dq-rA="
                }
                description={`Artist`}
                type="artist"
                data={item}
              />
            );
          })}
          {this.state.playlists.length > 0 && (
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
              Playlists
            </Text>
          )}
          {this.state.playlists.map((item) => {
            return (
              <Item
                showPlaylist={this.props.navigation.navigate}
                key={item.id}
                title={item.name}
                image={item.cover[0].url}
                description={`Playlist`}
                type="playlist"
                data={item}
              />
            );
          })}
          <View style={{ height: 100 }}></View>
        </ScrollView>
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
    marginTop: 30,
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 12,
    paddingRight: 12,
    height: 100,
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
    width: "100%"
  },
  SearchBar: {
    height: 40,
    margin: 10,
    width: "90%",
    padding: 10,
    backgroundColor: "#404040",
    color: "#fff",
    borderRadius: 10,
    alignSelf: "center",
  },
});
