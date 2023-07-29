import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
const image = require("../assets/background.png");
const Container = ({ child }) => {
  return (
    <View style={styleSheet.container}>
      <ImageBackground style={styleSheet.image} source={image}>
        {child}
      </ImageBackground>
    </View>
  );
};

export default Container;

const styleSheet = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height : 280,
    justifyContent: "center",
    resizeMode: "cover",
  },
});
