import React, { useEffect, useState } from "react";
import { View, Image, Text, ScrollView, Alert } from "react-native";
import Container from "../../components/Container";
import { AuthStartStyles } from "../../styles/AuthStartStyles";
import CustomButton from "../../components/CustomButton";
import Title from "../../components/Title";
import { addSummary, summerizeText } from "../../services/summarize_service";
import { getFromStorage } from "../../services/local_storage_service";
import LoadingIndicator from "../../components/Loading";
import { Audio } from "expo-av";
import Button from "../../components/Button";
import { useNavigation } from "expo-router";
const ProcessAudioPage = () => {
  const [summerisedText, setSummerisedText] = useState("");
  const [shouldLoad, setShouldLoad] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const navigate = useNavigation();
  useEffect(() => {
    setShouldLoad(true);
    getFromStorage("SELECTED_URL").then(async (url) => {
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      setSound(sound);
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      setShouldLoad(false);
    });
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, []);
  useEffect(() => {
    const updatePosition = () => {
      if (sound && isPlaying) {
        sound.getStatusAsync().then(({ position, duration }) => {
          setPosition(position);
          setDuration(duration);
        });
      }
    };

    const interval = setInterval(updatePosition, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [sound, isPlaying]);
  const onPlaybackStatusUpdate = (status) => {
    if (status.durationMillis === status.positionMillis) {
      setIsPlaying(false);
      finishAlert();
    }
  };
  const finishAlert = () => {};
  const playSound = async (url) => {
    setIsPlaying(true);
    await sound.playAsync();
    console.log("song is playing");
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };
  if (shouldLoad) {
    return <LoadingIndicator />;
  }
  return (
    <Container
      child={
        <View style={{ flex: 1, alignItems: "center" }}>
          <Title />
          <View style={{ ...AuthStartStyles.card, height: 600 }}>
            <Text style={{ ...AuthStartStyles.text, fontSize: 24 }}>
              Summarize File
            </Text>
            {!summerisedText && (
              <CustomButton
                imagePath={require("../../assets/player.png")}
                onPress={() => {
                  playSound();
                }}
                text={"Play music"}
              />
            )}
            {summerisedText && (
              <View>
                {
                  <View>
                    <View style={{ height: 16 }} />
                    <ScrollView>
                      <Text style={{ fontSize: 18 }}>{summerisedText}</Text>
                    </ScrollView>
                    <Button
                      onPressed={async () => {
                        setShouldLoad(true);
                        try {
                          const text = await getFromStorage(
                            "SELECTED_CONVERTED_TEXT"
                          );
                          // console.log(text);
                          await addSummary(summerisedText, text);
                          Alert.alert("Hey", "Summary saved successfully");
                        } catch (err) {
                          Alert.alert("OOps", "Summary saving failed");
                        }

                        setShouldLoad(false);
                        navigate.goBack();
                      }}
                      text={"Save"}
                    />
                  </View>
                }
              </View>
            )}
            {!summerisedText && (
              <CustomButton
                imagePath={require("../../assets/note.png")}
                onPress={async () => {
                  setShouldLoad(true);
                  const text = await getFromStorage("SELECTED_CONVERTED_TEXT");
                  const t = await summerizeText(text);
                  console.log(t);
                  setSummerisedText(t);
                  setShouldLoad(false);
                }}
                text={"Summarize"}
              />
            )}
          </View>
        </View>
      }
    />
  );
};

export default ProcessAudioPage;
