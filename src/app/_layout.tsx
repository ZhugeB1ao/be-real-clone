import { AuthProvider } from "@/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const router = useRouter();
  let isLoggedIn = false;

  useEffect(() => {
    if (isLoggedIn)  router.replace("/(tabs)");
    else router.replace("/(auth)/login");   
  }, []);

  return (
    <AuthProvider>
      <Stack 
        screenOptions={{
          headerStyle: {
            backgroundColor: "cornflowerblue",
          },
          headerTintColor: "white",
          animation: "slide_from_right",
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="(tabs)"
          options={{
            title: "Home",
          }}
        />
        <Stack.Screen 
          name="(auth)"
          options={{
            title: "Login",
          }}
        />

        
      </Stack>
    </AuthProvider>
  )
}
