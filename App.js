
import { Player } from './ui/player.js';
import { BottomMenu } from './ui/bottomMenu.js';
import { Home } from './page/home.js';
import { Search } from './page/search.js';
import { My } from './page/my.js';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

const pages = [<Home></Home>, <Search></Search>, <My></My>]


export default function App() {
    return (
      <View style={styles.ParentContainer}>
        <ScrollView>
          {pages[0]}
        </ScrollView>
        
      <View style={styles.Container}>
        <Player></Player>
        <BottomMenu></BottomMenu>
      </View>
      </View>
    );
}

const styles = StyleSheet.create({
  ParentContainer: {
    backgroundColor: '#262626',
    height: '100%',
  },
  Container: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#262626',
    alignItems: 'center',
    width: '100%',
  },
});
