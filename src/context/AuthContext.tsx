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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
    }

    const register = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if(error) throw error;

        if(data.user) {
            console.log(data.user);
            
            // const newUser: User = {
            //     email: data.user.email || "",
            //     password: data.user.password || "",
            // };
            // setUser(newUser);
        }
    }

    return (
        <AuthContext.Provider value={{user, login, register}}>
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
