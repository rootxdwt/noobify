import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { Component } from "react/cjs/react.production.min";
import Icon from "react-native-vector-icons/FontAwesome5";

var playpause = [
  <Icon name="play" size={18} />,
  <Icon name="pause" size={18} />,
];
var largeplaypause = [
  <Icon name="play" size={30} />,
  <Icon name="pause" size={30} />,
];

export class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      play: 0,
      height: 57,
      maximized: false,
      bottom: 101,
      borderRadius: 8,
      width: 0.95,
      draggedPercentage: 0,
    };
    this.touchStart = 0;
    this.interfaceY = Dimensions.get("window").height;
    this.interfaceX = Dimensions.get("window").width;
  }

  togglePlay() {
    var n;
    switch (this.state.play) {
      case 1:
        n = 0;
        break;
      case 0:
        n = 1;
        break;
    }
    this.setState({ play: n });
  }

  startMove(e) {
    this.touchStart = this.interfaceY - e.nativeEvent.pageY;
  }

  Move(e) {
    var touchOffset = this.interfaceY - e.nativeEvent.pageY - this.touchStart;
    this.setState({ draggedPercentage: this.state.height / this.interfaceY });
    this.setState({ width: 0.95 + 0.05 * this.state.draggedPercentage });
    this.setState({ borderRadius: 8 - 8 * this.state.draggedPercentage });
    if (touchOffset > 0 && !this.state.maximized) {
      this.setState({ height: 57 + touchOffset });
      this.setState({ bottom: 111 - 111 * this.state.draggedPercentage });
    } else if (touchOffset < 0 && this.state.maximized) {
      this.setState({ height: this.interfaceY + touchOffset });
      this.setState({ bottom: 111 - 111 * this.state.draggedPercentage });
    }
  }

  Release() {
    var n;
    if (!this.state.maximized) {
      n = 3;
    } else {
      n = 1;
    }
    if (this.state.height < this.interfaceY / n - 123) {
      //Minimized style
      this.setState({ height: 57 });
      this.setState({ maximized: false });
      this.setState({ bottom: 101 });
      this.setState({ borderRadius: 8 });
      this.setState({ width: 0.95 });
      this.setState({ draggedPercentage: 0 });
    } else {
      //Maximized style
      this.setState({ height: this.interfaceY });
      this.setState({ maximized: true });
      this.setState({ bottom: 0 });
      this.setState({ borderRadius: 0 });
      this.setState({ width: 1 });
      this.setState({ draggedPercentage: 1 });
    }
  }

  render() {
    console.log(this.state.bottom);
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          width: this.state.width * 100 + "%",
          height: this.state.height,
          borderRadius: this.state.borderRadius,
          backgroundColor: `#364954`,
          position: "absolute",
          bottom: 101,
          overflow: "hidden",
          zIndex: 1,
        }}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(e) => this.startMove(e)}
        onResponderMove={(e) => this.Move(e)}
        onResponderRelease={(e) => this.Release(e)}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              height:
                40 + (this.interfaceX - 150) * this.state.draggedPercentage,
              width:
                40 + (this.interfaceX - 150) * this.state.draggedPercentage,
              marginLeft: this.state.maximized
                ? (this.interfaceX -
                    (40 +
                      (this.interfaceX - 150) * this.state.draggedPercentage)) /
                  2
                : 7,
              marginTop: 300 * this.state.draggedPercentage,
              borderRadius: 8,
              marginRight: 10,
            }}
            source={{
              uri: "https://cdn.xdcs.me/static/main/1000x1000-000000-80-0-0.jpg",
            }}
          ></Image>

          <View style={styles.SongInfo}>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                opacity: 1 - this.state.draggedPercentage,
              }}
            >
              러브래터
            </Text>
            <Text
              style={{
                color: "#fff",
                opacity: 1 - this.state.draggedPercentage,
              }}
            >
              아이유
            </Text>
          </View>
          <View style={{ marginRight: 18 }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 13,
                opacity: 1 - this.state.draggedPercentage,
              }}
              onPress={() => this.togglePlay()}
            >
              {playpause[this.state.play]}
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: 0,
            margin: 0,
            bottom: 0,
            marginTop: 300 * this.state.draggedPercentage,
            display: this.state.maximized ? "flex" : "none",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 25,
              fontWeight: "bold",
              opacity: this.state.draggedPercentage,
            }}
          >
            러브레터
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 15,
              opacity: this.state.draggedPercentage,
            }}
          >
            아이유
          </Text>
          <View
            style={{
              width: "80%",
              height: 2,
              backgroundColor: "#fff",
              opacity: this.state.draggedPercentage,
              margin: 30,
            }}
          ></View>
          <View
            style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
          >
            <Text style={{ color: "#fff" }}>
              <Icon name="backward" size={25}></Icon>
            </Text>
            <Text
              onPress={() => this.togglePlay()}
              style={{ color: "#fff", marginLeft: 50, marginRight: 50 }}
            >
              {largeplaypause[this.state.play]}
            </Text>
            <Text style={{ color: "#fff" }}>
              <Icon name="forward" size={25}></Icon>
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: 2,
            backgroundColor: "#fff",
            opacity: 1 - this.state.draggedPercentage,
          }}
        ></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MinimizedPlayer: {
    flex: 1,
    flexDirection: "column",
    width: "95%",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    // position: "absolute",
    bottom: 101,
    overflow: "hidden",
  },
  MaximizedPlayer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    height: "100%",
    borderRadius: 0,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    // position: "absolute",
    bottom: 0,
    zIndex: 1,
    overflow: "hidden",
  },
  CoverImg: {
    height: 40,
    width: 40,
    marginLeft: 7,
    borderRadius: 8,
    marginRight: 10,
  },
  SongInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
  },
});
