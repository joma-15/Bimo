import React from "react";
import { Text, StyleSheet, View } from "react-native";

export function Signup() {
  return (
    <View>
      <Text style={styles.Text}>🫵</Text>
      <Text style={styles.Textcome}>bukas na to putang ina</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  Text: {
    fontSize: 100,
    marginTop: 250,
    marginLeft: 140,
  },

  Textcome: {
    fontSize: 30,
    marginTop: 20,
    marginLeft: 50,
  }
});
