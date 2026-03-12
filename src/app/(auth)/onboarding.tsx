import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { supabase } from "@/lib/supabase/client";
import { uploadProfileImage } from "@/lib/supabase/storage";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

export default function OnBoarding() {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please allow access to your media library to select a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please allow access to your camera to take a profile picture.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  }

  const showImagePicker = () => {
    Alert.alert(
      "Select Profile Picture",
      "Choose an option",
      [
        { text: "Take Photo", onPress: takePhoto },
        { text: "Choose from Library", onPress: pickImage },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  }

  const handleComplete = async () => {
    if(!fullName || !userName) 
      Alert.alert("Error", "Please fill in all fields")
    
    if (userName.length < 3)
      Alert.alert("Error", "Username must be at least 3 characters")

    setIsLoading(true)
    try {
      if(!user) {
        throw new Error("User not authenticated");
      }

      // Check if username is already taken
      // We also need to make sure to exclude the current user's profile from this check, otherwise they won't be able to keep their existing username if they are just updating their profile without changing the username.
      const { data: existingUser } = await supabase
        .from("profiles") 
        .select("id")
        .eq("username", userName)
        .neq("id", user.id)
        .single();

      if(existingUser) {
        Alert.alert("Error", "Username already taken, Please choose another one")
        setIsLoading(false)
        return;
      }

      // Upload profile image 
      let profileImageUrl: string | undefined;
      if(profileImage) {     
        try {
          profileImageUrl = await uploadProfileImage(user.id, profileImage);
        } catch (error) {
          Alert.alert("Error", "Failed to upload profile image, Please try again")
          setIsLoading(false)
          return;
        }
      }

      // Update user profile
      await updateUser({
        name: fullName,
        userName: userName,
        profileImage: profileImageUrl,
        onboardingCompleted: true,
      });
 
      router.replace("/(tabs)")

    } catch (error) {
      Alert.alert("Error", "Failed to complete onboarding, Please try again")
    } finally {
      setIsLoading(false)
    }

  }

  return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.container} >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subTitle}>Add your information to get started</Text>
            </View>

            <View style={styles.form}>
              <TouchableOpacity style={styles.imageContainer} onPress={showImagePicker}>
                {profileImage ? (
                  <Image style={styles.profileImage} source={{ uri: profileImage }} />) : (
                    <View style={styles.placeholderImage}>
                      <Text style={styles.placeholderText}>+</Text>
                    </View>
                  )
                }
      
                <View style={styles.editBadge}>
                  <Text style={styles.editText}>Edit</Text>
                </View>
              </TouchableOpacity>

              <TextInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
                autoCapitalize="words"
              />
              <TextInput
                placeholder="Username"
                value={userName}
                onChangeText={setUserName}
                style={styles.input}
                autoCapitalize="none"
                autoComplete="username"
              />
              <TouchableOpacity style={styles.button} onPress={handleComplete}>
                  {isLoading ? (
                    <ActivityIndicator size={24} color="#fff"/>
                  ) : (
                    <Text style={styles.buttonText}>Complete Setup</Text>
                  )}
              </TouchableOpacity>
            </View>
          </View>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  content: {
    width: "100%",
  },

  header:{
    marginBottom: 32,
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#050505",
    marginBottom: 6,
  },

  subTitle: {
    fontSize: 15,
    color: "#65676B",
    marginBottom: 24,
  },

  form: {
    width: "100%",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  imageContainer: {
    marginBottom: 32,
    position: "relative",
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f5f5f5",
  },

  placeholderImage: {
    width: 120,
    height: 120,
    backgroundColor: "#f5f5f5",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },

  placeholderText: {
    fontSize: 48,
    color: "#999",
  },

  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  editText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#CCD0D5",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 14,
  },

  button: {
    height: 48,
    backgroundColor: "#000",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    width: "100%",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  linkButton: {
    marginTop: 18,
    alignItems: "center",
  },

  linkText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#65676B",
  },

  linkTextBold: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});