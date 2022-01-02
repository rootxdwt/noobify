import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import { Component } from "react/cjs/react.production.min";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const icons = {
  Home: [
    <Icon name="home-variant" size={25} />,
    <Icon name="home-variant-outline" size={25} />,
  ],
  Search: [
    <Icon name="feature-search" size={23} />,
    <Icon name="feature-search-outline" size={23} />,
  ],
  User: [
    <Icon name="account" size={25} />,
    <Icon name="account-outline" size={25} />,
  ],
};

export class BottomMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { Active: [0, 1, 1] };
  }

  menuButtonPress(obj) {
    var lst = [1, 1, 1];
    lst[obj] = 0;
    this.setState({ Active: lst });
  }

  render() {
    return (
      <View style={styles.BottomMenu}>
        <View style={styles.Button}>
          <Text
            style={{ color: "#fff", fontSize: 18 }}
            onPress={() => this.menuButtonPress(0)}
          >
            {icons.Home[this.state.Active[0]]}
          </Text>
          <Text style={{ color: "#fff", fontSize: 10 }}>Home</Text>
        </View>
        <View style={styles.Button}>
          <Text
            style={{ color: "#fff", fontSize: 18 }}
            onPress={() => this.menuButtonPress(1)}
          >
            {icons.Search[this.state.Active[1]]}
          </Text>
          <Text style={{ color: "#fff", fontSize: 10 }}>Search</Text>
        </View>
        <View style={styles.Button}>
          <Text
            style={{ color: "#fff", fontSize: 18 }}
            onPress={() => this.menuButtonPress(2)}
          >
            {icons.User[this.state.Active[2]]}
          </Text>
          <Text style={{ color: "#fff", fontSize: 10 }}>My</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  BottomMenu: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#363636",
    alignItems: "center",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 91,
    paddingBottom: 32,
  },
  Button: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
