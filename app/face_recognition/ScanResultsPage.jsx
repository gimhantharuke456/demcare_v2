import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Container from "../../components/Container";
import Title from "../../components/Title";
import Button from "../../components/Button"
const ScanResultsPage = () => {
  return (
    <Container
      child={
        <View style={{ flex: 1, alignItems: "center" }}>
          <Title />
          <Image
            style={styles.image}
            source={require("../../assets/music.png")}
          />
          <View style={styles.card}>
            <Text style={styles.text}>Name : </Text>
            <Text style={styles.text}>RelationShip : </Text>
          </View>
          <View>
            <Button onPressed={()=>{}} text={"SEE MEMMORIES"}/>
            
          </View>
        </View>
      }
    />
  );
};

export default ScanResultsPage;

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    borderRadius: 500,
  },
  card: {
    elevation: 1,
    width : 350,
    alignItems: "flex-start",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 32,
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    color: "#10658C",
    fontWeight: "700",
  },
});
