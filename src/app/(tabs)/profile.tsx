import { Text, View, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { BottomSheet, Button, ColorPicker, Host, VStack } from "@expo/ui/swift-ui";
import { useState } from "react";
import ColorPickerIOS from "@/components/color-picker.ios";
import { Platform } from "react-native";

export default function Profile() {
    // const [isOpened, setIsOpened] = useState(false);
    // const [color, setColor] = useState("#000000");
  return (
    <View style={styles.container}>
      {/* <Text style={styles.redTitle}>Profile Screen</Text> */}
      {Platform.OS === "ios" ? <ColorPickerIOS /> : null} 
      {/* <ColorPickerIOS /> */}
      {/* <Host> */}
        {/* <Button onPress={() => setIsOpened(true)}>
            <Text>Open Bottom Sheet</Text>
        </Button> */}
        {/* <ColorPickerIOS /> */}
        {/* <VStack>
            <BottomSheet isOpened={isOpened} onIsOpenedChange={setIsOpened}>
                <View style={{ height: 300, alignItems: "center", justifyContent: "center" }}>
                    <Text>This is a bottom sheet</Text>
                </View>
            </BottomSheet>
        </VStack> */}
      {/* </Host>  */}
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
