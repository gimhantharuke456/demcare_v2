import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

const Button = ({ text, onPressed }) => {
  return (
    <TouchableOpacity onPress={onPressed} style={stlyes.wrapper}>
      <View>
        <Text style={stlyes.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const stlyes = StyleSheet.create({
  wrapper: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    backgroundColor: "#71C8F1",
    borderRadius : 12,
    marginVertical : 16,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
  },
});
