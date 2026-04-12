import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/.expo/navigation/type";
import DateTimePicker from "@react-native-community/datetimepicker";

type SignupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Signup"
>;

type Props = {
  navigation: SignupScreenNavigationProp;
};

export function Signup({ navigation }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const slideAnim = useRef(new Animated.Value(600)).current;

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 600,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleSignup = () => {
    console.log("Sign up with:", name, email, password, birthdate);
    // Registration logic here
    closeModal();
  };

  return (
    <View style={styles.container}>
      {/* Main screen */}
      <Image
        source={require("../assets/images/char.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Join Bimo!</Text>
      <Text style={styles.subtitle}>Your next spark is one step away 💘</Text>

      {/* Opens the modal form */}
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>Get Started</Text>
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
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
        >
          Log In
        </Text>
      </Text>

      {/* Bottom sheet modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        {/* Dimmed backdrop — tapping closes the sheet */}
        <Pressable style={styles.backdrop} onPress={closeModal} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              styles.modalSheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Drag handle pill */}
            <View style={styles.handle} />

            <Text style={styles.modalTitle}>Create Your Account</Text>
            <Text style={styles.modalSubtitle}>
              Fill in your details below ✨
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor="#999"
                autoCapitalize="words"
              />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
              {/* <TextInput
                placeholder="Date of Birth (MM/DD/YYYY)"
                value={birthdate}
                onChangeText={setBirthdate}
                style={styles.input}
                placeholderTextColor="#999"
                keyboardType="numbers-and-punctuation"
              /> */}

              <Pressable onPress={() => setOpen(true)}>
                <TextInput
                  value={date.toLocaleDateString()}
                  editable={false}
                  pointerEvents="none"
                  style={styles.input}
                />
              </Pressable>

              {open && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setOpen(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}

              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholderTextColor="#999"
                secureTextEntry
              />
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                placeholderTextColor="#999"
                secureTextEntry
              />

              <Text style={styles.termsText}>
                By signing up, you agree to our{" "}
                <Text style={styles.termsLink}>Terms of Service</Text> &{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSignup}
              >
                <Text style={styles.modalButtonText}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- Main screen ---
  container: {
    flex: 1,
    backgroundColor: "#E8E8E2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 60,
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
  loginLink: {
    fontWeight: "600",
    color: "#4F46E5",
  },

  // --- Modal / bottom sheet ---
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
    pointerEvents: "box-none",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: "88%",
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "black",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#D0D0D0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#667085",
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  input: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    color: "#101828",
  },
  termsText: {
    fontSize: 12,
    color: "#667085",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  termsLink: {
    color: "#4F46E5",
    fontWeight: "600",
  },
  modalButton: {
    backgroundColor: "#C7FF01",
    paddingVertical: 15,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    borderColor: "black",
    borderWidth: 2,
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#020101",
    fontSize: 18,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#667085",
    fontSize: 15,
    fontWeight: "500",
  },
});
