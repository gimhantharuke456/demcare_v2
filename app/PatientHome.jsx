import React from "react";
import { View } from "react-native";
import Container from "../components/Container";
import Title from "../components/Title";
import { AuthStartStyles } from "../styles/AuthStartStyles";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";
const PatientHome = () => {
  const router = useRouter();
  return (
    <Container
      child={
        <View style={{ flex: 1, alignItems: "center" }}>
          <Title />
          <View style={{...AuthStartStyles.card,padding : 8,height : 600}}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomButton
                imagePath={require("../assets/music.png")}
                onPress={() => {
                  router.push("/audio_diary/AudioDiaryHome");
                }}
                text={"Audio Diary"}
              />
              <CustomButton
                imagePath={require("../assets/player.png")}
                onPress={() => {
                  router.push("/music_player/ScanPage");
                }}
                text={"Music Player"}
              />
            </View>
            <View>
              <CustomButton
                imagePath={require("../assets/mem.jpg")}
                onPress={() => {
                  router.push("/face_recognition/Recognitionpage")
                }}
                text={"Memories"}
              />
            </View>
          </View>
        </View>
      }
    />
  );
};

export default PatientHome;
