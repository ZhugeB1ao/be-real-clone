import { Text, View, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import { Button, Host } from "@expo/ui/swift-ui";

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.redTitle}>Home Screen</Text>
      
      <TextInput placeholder="Enter text here" />
      <ActivityIndicator size={"large"}/>

      <Link href="/about">
        <Text>Go to About screen</Text>
      </Link>
      <Host>
        <Button 
          onPress={() => router.push("/profile")} 
        >
            <Text>Go to Profile</Text>
        </Button>
      </Host>
      
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
