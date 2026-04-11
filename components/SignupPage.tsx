import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/.expo/navigation/type";

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Signup">;

type Props = {
  navigation: SignupScreenNavigationProp;
};

export function Signup({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const handleSignup = () => {
    console.log("Sign up with:", name, email, password, birthdate);
    // Registration logic here
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >

      <Text style={styles.title}>Join Bimo!</Text>
      <Text style={styles.subtitle}>Your next spark is one step away 💘</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="black"
          autoCapitalize="words"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          placeholderTextColor="black"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Date of Birth (MM/DD/YYYY)"
          value={birthdate}
          onChangeText={setBirthdate}
          style={styles.input}
          placeholderTextColor="black"
          keyboardType="numbers-and-punctuation"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="black"
          secureTextEntry
        />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          placeholderTextColor="black"
          secureTextEntry
        />
      </View>

      <Text style={styles.termsText}>
        By signing up, you agree to our{" "}
        <Text style={styles.termsLink}>Terms of Service</Text> &{" "}
        <Text style={styles.termsLink}>Privacy Policy</Text>
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialText}>Continue with Instagram</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Text style={styles.login} onPress={() => navigation.navigate("Login")}>
          Log In
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E8E8E2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#101828",
  },
  subtitle: {
    fontSize: 16,
    color: "#667085",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  termsText: {
    fontSize: 12,
    color: "#667085",
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  termsLink: {
    color: "#4F46E5",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#C7FF01",
    paddingVertical: 15,
    width: "100%",
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
    borderColor: "black",
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
    color: "#344054",
    fontWeight: "500",
  },
  footerText: {
    marginTop: 20,
    color: "black",
  },
  login: {
    fontWeight: "600",
    color: "#4F46E5",
  },
});