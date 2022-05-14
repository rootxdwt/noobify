import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { Component } from "react/cjs/react.production.min";
import Icon from "react-native-vector-icons/MaterialIcons";
import api from "../api";

let cachedHomedata=[]

export class Home extends Component {
  constructor(props) {
    super(props);
    this.DOMList = [];
    this.state = {
      shelves: [],
    };
    this.disableCache=false
  }

  componentDidMount = async () => {
    if(cachedHomedata.length==0 || this.disableCache){
      this.mounted = true;
      const {
        data: { shelves },
      } = await api.get("/recommendations", {
        timeout: 10000,
      });
      console.log("[Shelves]", "Fetched");
      cachedHomedata=shelves
      if (this.mounted) this.setState({ shelves });
    }else{
      this.setState({ shelves: cachedHomedata });
      console.log("[Shelves]", "Displayed cached data");
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  render() {
    return (
      <ScrollView style={{backgroundColor: "#262626"}}>
        <View style={styles.Header}>
          <Text style={{ fontWeight: "bold", fontSize: 25, color: "#fff" }}>
            Noobify
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 20, color: "#fff" }}>
            <Icon name="settings" size={25} />
          </Text>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            color: "#fff",
            margin: 20,
            marginLeft: 12,
          }}
        >
          Listen Again
        </Text>
        <View style={styles.MusicFixedConti}>
          <View style={styles.wideMusicBox}>
            <Image
              style={{ width: 60, height: 60, borderRadius: 0 }}
              source={{
                uri: "https://cdn.xdcs.me/static/main/EZZP8m1U8AAfAyk.jpg",
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
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#fff",
                  marginTop: 10,
                  fontSize: 12,
                }}
              >
                MORE AND MORE
              </Text>
              <Text
                style={{
                  fontWeight: "normal",
                  color: "#949494",
                  fontSize: 9,
                }}
              >
                Single-TWICE
              </Text>
            </View>
          </View>
          <View style={styles.wideMusicBox}>
            <Image
              style={{ width: 60, height: 60, borderRadius: 0 }}
              source={{
                uri: "https://cdn.xdcs.me/static/main/11ce49830b65761f2d0725eddaccc3cc.jpg",
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
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#fff",
                  marginTop: 10,
                  fontSize: 12,
                }}
              >
                WHAT IS LOVE
              </Text>
              <Text
                style={{
                  fontWeight: "normal",
                  color: "#949494",
                  fontSize: 9,
                }}
              >
                Single-TWICE
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            color: "#fff",
            marginBottom: 20,
            marginLeft: 12,
          }}
        >
          Songs
        </Text>
        <View style={{ flex: 1, flexDirection: "column", marginLeft: 10 }}>
          <View style={styles.superWideMusicBox}>
            <Image
              style={{ width: 60, height: 60, borderRadius: 5 }}
              source={{
                uri: "https://cdn.xdcs.me/static/main/EZZP8m1U8AAfAyk.jpg",
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
                MORE AND MORE
              </Text>
              <Text style={{ fontWeight: "normal", color: "#949494" }}>
                Single-TWICE
              </Text>
            </View>
          </View>
          <View style={styles.superWideMusicBox}>
            <Image
              style={{ width: 60, height: 60, borderRadius: 5 }}
              source={{
                uri: "https://cdn.xdcs.me/static/main/11ce49830b65761f2d0725eddaccc3cc.jpg",
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
                WHAT IS LOVE
              </Text>
              <Text style={{ fontWeight: "normal", color: "#949494" }}>
                Album-TWICE
              </Text>
            </View>
          </View>
          <View style={styles.superWideMusicBox}>
            <Image
              style={{ width: 60, height: 60, borderRadius: 5 }}
              source={{
                uri: "https://cdn.xdcs.me/static/main/Dhl2AOUUcAABtwH.jpg",
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
              <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 14 }}>
                SUMMER NIGHTS
              </Text>
              <Text
                style={{
                  fontWeight: "normal",
                  color: "#949494",
                  fontSize: 14,
                }}
              >
                Album-TWICE
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.Main}>
          {this.state.shelves.map((shelf) => {
            return (
              <View key={shelf.id}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    color: "#fff",
                    marginBottom: 20,
                    marginLeft: 12,
                    marginTop: 12,
                  }}
                >
                  {shelf.title}
                </Text>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  style={styles.MusicScroll}
                  horizontal={true}
                >
                  {shelf.content.map((item) => {
                    return (
                      <View style={styles.MusicBox} key={item.id}>
                        <Pressable
                        onPress={()=>this.props.navigation.navigate('Playlist',{id: item.id, type: item.description?"playlist":"album"})}
                        >
                          <Image
                            style={{ width: 130, height: 130, borderRadius: 5 }}
                            source={{
                              uri: item.cover[0].url,
                            }}
                          ></Image>
                          <View
                            style={{
                              flex: 1,
                              alignItems: "flex-start",
                              flexDirection: "column",
                              width: 125,
                            }}
                          >
                            <Text
                              numberOfLines={1}
                              style={{
                                fontWeight: "bold",
                                color: "#fff",
                                marginTop: 10,
                                textAlign: "left",
                              }}
                            >
                              {item.name}
                            </Text>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontWeight: "normal",
                                color: "#949494",
                                textAlign: "left",
                              }}
                            >
                              {item.description}
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            );
          })}

          <View style={{ height: 200 }}></View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  Main: {
    marginLeft: 0,
  },
  Header: {
    marginTop: 30,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 25,
    paddingLeft: 12,
    paddingRight: 12,
  },
  MusicScroll: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    height: 180,
  },
  MusicFixedConti: {
    flex: 1,
    height: 80,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    paddingRight: 10,
  },
  MusicBox: {
    marginLeft: 5,
    width: 140,
    height: 180,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  wideMusicBox: {
    height: 60,
    width: 170,
    borderRadius: 5,
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#303030",
    overflow: "hidden",
    marginLeft: 10,
  },
  superWideMusicBox: {
    width: "80%",
    height: 60,
    flex: 1,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
