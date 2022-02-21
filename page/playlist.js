import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { Component } from "react/cjs/react.production.min";
import Icon from "react-native-vector-icons/MaterialIcons";
import api from "../api";

export class Playlist extends Component {
  state = {
    data: null,
  };

  componentDidMount() {
    api.get("/playlist/" + this.props.id).then((res) => {
      console.log("[Playlist]", "Fetched");
      this.setState({
        data: res.data,
      });
    });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.Header}>
          <Image
            source={{
              uri: this.state.data
                ? this.state.data.songs[0].album.cover[0].url
                : "https://i.scdn.co/image/ab67706f000000026fa34921563906dd4c9e3f8e",
            }}
            style={{ width: 150, height: 150, borderRadius: 5 }}
          ></Image>
          <View style={{ marginLeft: 17 }}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
              {this.state.data ? this.state.data.name : "Loading..."}
            </Text>
            <Text style={{ color: "#949494" }}>
              {this.state.data
                ? this.state.data.songs[0].name + "..."
                : "Loading..."}
            </Text>
          </View>
        </View>
        <View style={{ padding: 20 }}>
          {this.state.data
            ? this.state.data.songs.map((item) => {
                return (
                  <View
                    style={{
                      width: "100%",
                      height: 60,
                      flex: 1,
                      marginTop: 10,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    key={item.id}
                  >
                    <Image
                      style={{ width: 60, height: 60, borderRadius: 5 }}
                      source={{
                        uri: item.album.cover[0].url,
                      }}
                    ></Image>
                    <View
                      style={{
                        flex: 1,
                        alignItems: "flex-start",
                        flexDirection: "column",
                        marginLeft: 10,
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: "#fff" }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontWeight: "normal", color: "#949494" }}>
                        {item.album.name}
                      </Text>
                    </View>
                  </View>
                );
              })
            : null}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  Header: {
    flex: 1,
    flexDirection: "row",
    padding: 19,
  },
});
