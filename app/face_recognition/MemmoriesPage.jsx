import React from "react";
import Container from "../../components/Container";
import { View, StyleSheet, Image, Text } from "react-native";
import Title from "../../components/Title";

const MemmoriesPage = () => {
  return (
    <Container
      child={
        <View style={{ flex: 1, alignItems: "center", }}>
          <Title />
          <Image
            source={require("../../assets/music.png")}
            style={styles.card}
          />
          <Text style={styles.text}>Memmories</Text>
          <View style={styles.imageListWrapper}></View>
        </View>
      }
    />
  );
};

export default MemmoriesPage;

const styles = StyleSheet.create({
  card: {
    width: 350,
    height: 300,
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    color: "#10658C",
    fontWeight: "700",
    marginVertical : 16,
  },
  imageListWrapper: {
    width: 400,
    height: 250,
    backgroundColor: "red",
  },
});
