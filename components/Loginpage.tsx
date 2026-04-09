import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useState } from "react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login with:", email, password);
    // Authentication logic here
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://i.ibb.co/3mYh7K6/bimo-cartoon-logo.png" }} // placeholder logo
        style={styles.logo}
      />
      <Image source={require("../assets/images/char.png")} style={styles.logo}/>
      <Text style={styles.title}>Welcome to Bimo!</Text>
      <Text style={styles.subtitle}>Find your match in a fun way 💖</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          placeholderTextColor={'black'}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor={'black'}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialText}>Continue with Instagram</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don’t have an account? <Text style={styles.signup}>Sign Up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E8E2ff", // soft off-white background
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 170,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#101828", // dark blue/gray
  },
  subtitle: {
    fontSize: 16,
    color: "#667085", // muted gray-blue
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
  },

  input: {
    backgroundColor: "#FFFFFF", // white input
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E4E7EC", // light gray border
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    
  },
  button: {
    backgroundColor: "#C7FF01ff", // vibrant purple-blue
    paddingVertical: 15,
    width: "100%",
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
    borderColor: 'black', 
    borderWidth: 2,
  },
  buttonText: {
    color: "#020101",
    fontSize: 18,
    fontWeight: "600",
  },
  orText: {
    marginVertical: 15,
    fontSize: 14,
    color: "#667085",
  },
  socialButton: {
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  socialText: {
    color: "#344054", // dark gray-blue
    fontWeight: "500",
  },
  footerText: {
    marginTop: 20,
    color: "black",
  },
  signup: {
    fontWeight: "600",
    color: "#4F46E5", // purple accent
  },
});