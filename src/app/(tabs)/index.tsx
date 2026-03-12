import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context"

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView 
      style={styles.container}
      edges={["top", "bottom"]}
    >
      
    </SafeAreaView> 
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
