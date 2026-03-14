import { Post } from "@/hooks/usePosts";
import { View, StyleSheet, Text } from "react-native";
import { formatTimeAgo, formatTimeRemaining } from "@/lib/date-helper";
import { useState } from "react";
import { Image } from "expo-image";

interface PostcardProps {
    post: Post;
    currentUserId?: string;
}

export default function PostCard({ post, currentUserId }: PostcardProps) {
    const postUser = post.profile;
    const isOwnPost = currentUserId === post.user_id;

    return (
        <View style={styles.postContainer}>
            <View style={styles.postHeader}>
                <View style={styles.userInfo}>
                    {postUser?.profile_image_url ? (
                        <Image
                            source={{ uri: postUser.profile_image_url }}
                            style={styles.avatar}
                            cachePolicy={"none"}
                        />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]} >
                            <Text style={styles.avatarText}>
                                {postUser?.name?.[0]?.toUpperCase() || "U"}
                            </Text>
                        </ View>
                    )}

                    <View>
                        <View>
                            <Text style={styles.username}>
                                {isOwnPost ? "You" : `@${postUser?.username}`}
                            </Text>
                            <Text style={styles.timeAgo}>{formatTimeAgo(post.created_at)}</Text>
                        </View>
                
                    </View>

                </View>
                
               <View style={styles.timeRemainingBadge}>
                    <Text style={styles.timeRemainingText}>
                        {formatTimeRemaining(post.expires_at)}
                    </Text>
                </View>
            </View>

            <Image
                source={{ uri: post.image_url }}
                style={styles.postImage}
                contentFit="cover"
                cachePolicy={"none"}
            />

            <View style={styles.postFooter}>
                {post.description && (
                    <Text style={styles.postDescription}>{post.description}</Text>
                )}
                <Text style={styles.postInfo}>
                    {isOwnPost ? "Your Post" : `${postUser?.name}' post`} • Expires in{" "}
                    {formatTimeRemaining(post.expires_at)}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
})