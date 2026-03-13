import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context"
import * as ImagePicker from "expo-image-picker";
import { Post, usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/context/AuthContext";
import PostCard from "@/components/PostCard";

export default function Index() {
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const { createPost, posts, loading: postsLoading, refreshPosts } = usePosts();
  const { user } = useAuth();

  // Check if user has an active post
  const userActivePost = posts?.find(
    post => post.user_id === user?.id && 
    post.is_active &&
    new Date(post.expires_at) > new Date() 
  );

  const hasActivePost = !!userActivePost;
  const onRefresh = async () => {
    setRefreshing(true);
    try{
      await refreshPosts();  
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setRefreshing(false);
    }
  }

  // Request media library permissions and allow the user to pick an image, then show the preview modal
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
      setPreviewImage(result.assets[0].uri);
      setShowPreview(true);
      setDescription("");
    }
  }
  
  // Request camera permissions and take a new photo, then show the preview modal
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
      setPreviewImage(result.assets[0].uri);
      setShowPreview(true);
      setDescription("");
    }
  }

  // Show an action sheet to choose between taking a photo or picking from the library
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

  // Handle posting the image with an optional description, then reset the preview state
  const handlePost = async () => {
    if (!previewImage) {
      Alert.alert("No Image", "Please select an image to post.");
      return;
    }

    setIsUploading(true);

    try {
      await createPost(previewImage, description);
      setShowPreview(false);
      setPreviewImage(null);
      setDescription("");
    } catch (error) {
      console.error("Error posting:", error);
      Alert.alert("Error", "An error occurred while posting. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  // Handle canceling the post creation and reset the preview state
  const handleCancel = () => {
    setShowPreview(false);
    setPreviewImage(null);
    setDescription("");
  }

  // Render each post item using the PostCard component, passing the current user ID for context
  const renderPost = ({ item }: { item: Post }) => (
    <PostCard post={item} currentUserId={user?.id}/>
  )

  return (
    <SafeAreaView 
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <FlatList 
        data={posts} 
        renderItem={renderPost} 
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          posts?.length === 0 ? styles.emptyContent : styles.content
        }
        ListEmptyComponent={
          <Text>No Post found</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity style={styles.fab} onPress={showImagePicker}>
        <Text style={styles.fabText}>{hasActivePost ? "↺" : "+"}</Text>
      </TouchableOpacity>

      <Modal visible={showPreview} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {" "}
              {hasActivePost ? "Replace Your Post" : "Preview Your Post"}
            </Text>
            {previewImage && (
              <Image source={{ uri: previewImage }} contentFit="cover" style={styles.modalImage} />
            )}
            <TextInput 
              style={styles.modalDescription}
              placeholder="Enter a description..."
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#999"
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleCancel} style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handlePost} style={[styles.modalButton, styles.postButton]}>
                {isUploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.postButtonText}>{hasActivePost ? "Replace Post" : "Post"}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  fab: {
    position: "absolute",
    bottom: 104,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  fabText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 32,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  modalImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
  },

  modalDescription: {
    width: "100%",
    minHeight: 80,
    maxHeight: 120,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#000",
  },

  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },

  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#f5f5f5",
  },

  cancelButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },

  postButton: {
    backgroundColor: "#000",
  },

  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  content: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  postContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  timeAgo: {
    fontSize: 12,
    color: "#666",
  },
  timeRemainingBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeRemainingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#f5f5f5",
  },
  postFooter: {
    padding: 16,
  },
  postDescription: {
    fontSize: 15,
    color: "#000",
    marginBottom: 8,
    lineHeight: 20,
  },
  postInfo: {
    fontSize: 14,
    color: "#666",
  },
});
