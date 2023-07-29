import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const CustomButton = ({ imagePath, text, onPress }) => {

  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <View style={styles.buttonBox}>
        <Image source={imagePath} style={styles.buttonImage} resizeMode="contain" />
      </View>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
  },
  buttonBox: {
    backgroundColor: "#5BD2EC",
    borderRadius: 12,
    width: windowWidth * 0.28,
    height: windowWidth * 0.45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonImage: {
    width: "80%",
    height: "80%",
  },
  buttonText: {
    color: "#5BD2EC",
    fontSize: windowWidth * 0.06,
    fontWeight : "bold",
    textAlign : "center",
    marginHorizontal : 8
  },
});

export default CustomButton;
