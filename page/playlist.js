import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { Component } from "react/cjs/react.production.min";
import Icon from "react-native-vector-icons/MaterialIcons";


export class Playlist extends Component {
    render() {
        return (
            <ScrollView>
                <View style={styles.Header}>
                    <Image source={{uri:"https://i.scdn.co/image/ab67706f000000026fa34921563906dd4c9e3f8e"}} style={{width: 150, height: 150, borderRadius: 5}}>
                    </Image>
                    <View style={{marginLeft: 17}}>
                        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>Favorites Mix</Text>
                        <Text style={{color: '#949494'}}>TWICE, IU, BTS, BLACKPINK</Text>
                    </View>
                    
                    
                </View>
                <View style={{padding: 20}}>
                    <View style={{width: "100%",height: 60,flex: 1,marginTop: 10,flexDirection: "row",alignItems: "center",}}>
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
                    
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    Header: {
        flex: 1,
        flexDirection: 'row',
        padding: 19
      },
  });
  