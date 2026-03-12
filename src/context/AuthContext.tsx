import { supabase } from "@/lib/supabase/client";
import { createContext, useContext, useState } from "react";

export interface User {
    id: string;
    email: string;
    name: string;
    userName: string;
    profileImage?: string;
    onboardingCompleted?: boolean;
}
interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);

    const fetchUserProfile = async (userId: string): Promise<User | null> => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
    
          if(error) {
            console.error("Error fetching user profile:", error);
            return null;
          }
          
          if (!data) {
            console.error("No profile data found for user ID:", userId);
            return null;
          } 

          const authUser = await supabase.auth.getUser();
          if(!authUser.data.user) {
            console.error("No authenticated user found");
            return null;
          }
        
          return {
            id: data.id,
            email: authUser.data.user.email || "",
            name: data.name,
            userName: data.userName,
            profileImage: data.profile_image_url,
            onboardingCompleted: data.onboarding_completed,
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          return null;
        }
    };

    const login = async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
      });

      if(error) throw error;

      if(data.user) {
          const profile = await fetchUserProfile(data.user.id);
          setUser(profile);
      }
    }

    const register = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if(error) throw error;

        if(data.user) {
            const profile = await fetchUserProfile(data.user.id);
            setUser(profile);
        }
    }

    const updateUser = async ( userData: Partial<User>) => {
      if(!user) return;
    
      try {
        const userDataToUpdate: any = {}

        if(userData.name !== undefined) userDataToUpdate.name = userData.name;
        if(userData.userName !== undefined) userDataToUpdate.username = userData.userName;
        if(userData.profileImage !== undefined) userDataToUpdate.profile_image_url = userData.profileImage;
        if(userData.onboardingCompleted !== undefined) userDataToUpdate.onboarding_completed = userData.onboardingCompleted;

        const { error } = await supabase
          .from("profiles")
          .update(userDataToUpdate)
          .eq("id", user.id)
       
        if(error) throw error;
      } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
      }
    }

    return (
        <AuthContext.Provider value={{user, login, register, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
