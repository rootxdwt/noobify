import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { Component } from "react/cjs/react.production.min";
import Icon from "react-native-vector-icons/MaterialIcons";
import api from "../api";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import audioLibrary from "../audio";

export class Playlist extends Component {
  state = {
    data: null,
  };

  componentDidMount() {
    console.log(this.props.type)
    console.log(this.props.id)
    console.log((this.props.type==="playlist"?"/playlist/":"/album/")+ this.props.id)
    api.get((this.props.type==="playlist"?"/playlist/":"/album/")+ this.props.id).then((res) => {
      console.log("[Playlist]", "Fetched");
      this.setState({
        data: res.data,
      });
    });
  }

  playFromPlaylistIndex = async (index) => {
    if(this.state.data.songs){
      await audioLibrary.setUniversalThumbnail(this.state.data.cover[0].url)
      await audioLibrary.setQueue(this.state.data.songs);
      await audioLibrary.setIndex(index);
      await audioLibrary.setPlaying(true);
    }
  };

  prevPage = () => {
    this.props.prevFunc();
  };
  render() {
    return (
      <>
        <Pressable
          style={{ height: 50, justifyContent: "center" }}
          onPress={() => {
            this.prevPage();
          }}
        >
          <Text style={{ color: "#fff", paddingLeft: 20, padding: 10 }}>
            <Icon name="arrow-back-ios" size={25} />
          </Text>
        </Pressable>
        <ScrollView>
          <View style={styles.Header}>
            <Image
              source={{
                uri: this.state.data
                  ? (this.props.type=="playlist"?this.state.data.songs[0].album.cover[0].url:this.state.data.cover[0].url)
                  : "https://i.ytimg.com/vi/Z-Q-Z-Q-Z-Q/maxresdefault.jpg",
              }}
              style={{ width: 150, height: 150, borderRadius: 5 }}
            ></Image>
            <View style={{ marginLeft: 17, flex: 1, flexDirection: "column" }}>
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
                {this.state.data ? this.state.data.name : "Loading..."}
              </Text>
              <Text style={{ color: "#949494" }}>
                {this.state.data
                  ? (this.props.type=="playlist"?this.state.data.songs[0].name + "...":this.state.data.artists.map((elem)=>elem.name).join(","))
                  : "Loading..."}
              </Text>
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#474747",
                  height: 40,
                  width: 100,
                  padding: 0,
                  marginTop: 20,
                  borderRadius: 5
                }}
                onPress={()=>this.playFromPlaylistIndex(0)}
              >
                <Text style={{ color: "#fff",marginRight: 5 }}>
                  <Icon name="play-arrow" size={25}></Icon>
                </Text>
                <Text style={{ color: "#fff",fontWeight:"bold" }}>Play</Text>
              </Pressable>
            </View>
          </View>
          <View style={{ padding: 20 }}>
            {this.state.data
              ? this.state.data.songs.map((item, index) => {
                  return (
                    <Pressable
                      style={{
                        width: "100%",
                        height: 60,
                        flex: 1,
                        marginTop: 10,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                      key={item.id}
                      onPress={() => this.playFromPlaylistIndex(index)}
                    >
                      <Image
                        style={{ width: 60, height: 60, borderRadius: 5 }}
                        source={{
                          uri: this.props.type=="playlist"?item.album.cover[0].url:this.state.data.cover[0].url,
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
                        <Text
                          style={{ fontWeight: "normal", color: "#949494" }}
                        >
                          {this.props.type=="playlist"?item.artists.map((elem)=>elem.name).join(","):item.artist}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })
              : null}
          </View>
        </ScrollView>
      </>
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
