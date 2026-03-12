import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  const { register } = useAuth()
  
  const handleSignUp = async () => {
    if(!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      await register(email, password)
      router.push("/(auth)/onboarding")
    } catch (error) {
      Alert.alert("Error", "Failed to Sign up, Please try again")
      console.error("Error signing up:", error);
    } finally { 
      setIsLoading(false)
    }
  }

  return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.container} >
          <View style={styles.content}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subTitle}>Sign Up to Get Started</Text>
              <View style={styles.form}>
                  <TextInput 
                      placeholder="Email..."
                      placeholderTextColor={"#999"}
                      keyboardType="email-address"
                      autoComplete="email"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                      style={styles.input}
                  />
                  <TextInput 
                      placeholder="Password..."
                      placeholderTextColor={"#999"}
                      autoComplete="password"
                      secureTextEntry
                      autoCapitalize="none"
                      value={password}
                      onChangeText={setPassword}
                      style={styles.input}
                  />
                  <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                      {isLoading ? (
                        <ActivityIndicator size={24} color="#fff"/>
                      ) : (
                        <Text style={styles.buttonText}>Sign Up</Text>
                      )}
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/(auth)/login")}>
                      <Text style={styles.linkText}>Already have an account? 
                          <Text style={styles.linkTextBold}> Sign In</Text>
                      </Text>
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

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
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