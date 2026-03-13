import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase/client";
import { uploadPostImage } from "../lib/supabase/storage";

export interface PostUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

export interface Post {
  id: string;
  user_id: string;
  image_url: string;
  description?: string;
  expires_at: string;
  is_active: boolean;
  created_at: string;
  profile?: PostUser;
}

export const usePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch all active posts from all users, including the profile information of the post creator
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
                        *,
                        profiles(id, name, username, profile_image_url)
                    `,
        )
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      console.log("Fetched posts data:", data);

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      if (!data || data.length === 0) {
        setPosts([]);
        return;
      }

      const postsWithProfile = data.map((post) => ({
        ...post,
        profile: post.profiles || null,
      }));

      setPosts(postsWithProfile);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (imageUri: string, description: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      // Keep only one active post per user by deactivating old active posts first.
      const { error: deactivateError } = await supabase
        .from("posts")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (deactivateError) {
        console.error("Error deactivating existing posts:", deactivateError);
        throw deactivateError;
      }

      const imageUrl = await uploadPostImage(user.id, imageUri);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Set expiration to 7 days from now

      const postData = {
        user_id: user.id,
        image_url: imageUrl,
        description: description || "",
        expires_at: expiresAt.toISOString(),
        is_active: true,
      };

      const { error } = await supabase
        .from("posts")
        .insert(postData)
        .select()
        .single();

      if (error) {
        console.error("Error inserting post data:", error);
        throw error;
      }

      // Refresh the posts list after creating a new post
      await fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  const refreshPosts = async () => {
    await fetchPosts();
  };
  
  return { createPost, posts, loading, fetchPosts, refreshPosts };
};
