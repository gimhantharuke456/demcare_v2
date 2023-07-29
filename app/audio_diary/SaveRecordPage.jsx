import React from "react";
import { View, Text, Image } from "react-native";
import Container from "../../components/Container";
import Title from "../../components/Title";
import { AuthStartStyles } from "../../styles/AuthStartStyles";
import Button from "../../components/Button";
const SaveRecordPage = () => {
  return (
    <Container
      child={
        <View style={{ flex: 1, alignItems: "center" }}>
          <Title />
          <View style={{ ...AuthStartStyles.card, height: 600 }}>
            <Image source={require("../../assets/calendar.png")} />
            <View>
              <Text></Text>
              <Text></Text>
              <Button onPressed={() => {}} text={"NEXT"} />
              <Button onPressed={() => {}} text={"RECORD AGAIN"} />
            </View>
          </View>
        </View>
      }
    />
  );
};

export default SaveRecordPage;
