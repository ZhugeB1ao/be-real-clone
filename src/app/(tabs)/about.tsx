import { Text, View, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { Image } from "expo-image";

export default function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.redTitle}>About Screen</Text>
      <Image 
        source={{
          uri: "https://media1.giphy.com/media/3o7aD2saalBwwftBIY/200w.webp?cid=ecf05e47m9nqj8l5h0y4g6l7u9v1tqjzj8s0b5c9d6e&ep=v1_gifs_search&rid=200w.webp&ct=g",
        }} 
        style={styles.Image}
      />
      </View> 

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  redTitle: {
    color: "red",
  },
  Image: {
    width: 200,
    height: 100,
  },
});
