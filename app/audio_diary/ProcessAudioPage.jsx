import React from "react";
import { View, Image, Text } from "react-native";
import Container from "../../components/Container";
import { AuthStartStyles } from "../../styles/AuthStartStyles";
import CustomButton from "../../components/CustomButton";
import Title from "../../components/Title";

const ProcessAudioPage = () => {
  return (
    <Container
      child={
        <View style={{ flex: 1, alignItems: "center" }}>
          <Title />
          <View style={{ ...AuthStartStyles.card, height: 600 }}>
            <Text style={{ ...AuthStartStyles.text, fontSize: 24 }}>
              Summarize Audio File
            </Text>
            <CustomButton
              imagePath={require("../../assets/note_search.png")}
              onPress={() => {}}
              text={"Convert To Text"}
            />
            <CustomButton
              imagePath={require("../../assets/note.png")}
              onPress={() => {}}
              text={"Summarize"}
            />
          </View>
        </View>
      }
    />
  );
};

export default ProcessAudioPage;
