import { Stack } from "expo-router";

export default function AuthLayout() {
    return(
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
                name="login"
                options={{
                    title: "Login",
                }}
            />
            <Stack.Screen 
                name="register"
                options={{
                    title: "Register",
                }}
            />
        </Stack>
    )
}