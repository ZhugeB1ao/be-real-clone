import { AuthProvider } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth} from "@/context/AuthContext";

function RouteGuard() {
  const router = useRouter();
  const { user } = useAuth();
  const segments = useSegments();

  const isAuthRoute = segments[0] === "(auth)";
  const isTabsRoute = segments[0] === "(tabs)";

  useEffect(() => {
    if (!user) {
      if(!isAuthRoute) {
        router.replace("/(auth)/login");
      }
    } else {
      if(!isTabsRoute) {
        router.replace("/(tabs)");
      }
    }
  }, [user, segments, router]);

  return (
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
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard />
    </AuthProvider>
  )
}
