import { StyleSheet, ScrollView } from "react-native";
import { Component } from "react/cjs/react.production.min";

export class Search extends Component {
    render() {
        return (
            <ScrollView style={styles.Main}>
                Search
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    Main: {
      flex: 1,
      backgroundColor: '#262626',
      height: 'calc(80%-10px)',
    },
  });