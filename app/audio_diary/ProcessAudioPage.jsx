import React, { useEffect, useState } from "react";
import { View, Image, Text, ScrollView, Alert } from "react-native";
import Container from "../../components/Container";
import { AuthStartStyles } from "../../styles/AuthStartStyles";
import CustomButton from "../../components/CustomButton";
import Title from "../../components/Title";
import { summerizeText } from "../../services/summarize_service";
import { getFromStorage } from "../../services/local_storage_service";
import LoadingIndicator from "../../components/Loading";
import { Audio } from "expo-av";
const ProcessAudioPage = () => {
  const [summerisedText, setSummerisedText] = useState("");
  const [shouldLoad, setShouldLoad] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

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
  const finishAlert = () => {
    Alert.alert(
      "Hey",
      "Do you want to listen this music again ?",
      [
        {
          text: "Yes",
          onPress: async () => {
            setShouldLoad(true);
            getFromStorage("SELECTED_URL").then(async (url) => {
              const { sound } = await Audio.Sound.createAsync({ uri: url });
              setSound(sound);
              sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
              setShouldLoad(false);
            });
            await playSound();
            return sound
              ? () => {
                  sound.unloadAsync();
                }
              : undefined;
          },
        },
        {
          text: "No",
          onPress: async () => {
            await saveInStorage("CURRENT_EMOTION", null);
            router.back();
          },
          style: "cancel",
        },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  };
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
                  const t = await summerizeText(
                    "DevOps Engineer at LSEG is responsible for the configuration and maintenance of the Continuous Integration and Continues Delivery pipelines which underpins our SDLC lifecycle. They also build tools & operational processes to improve productivity of the entire organization.The intern is expected to work independently with guidance provided by our senior DevOps Engineers in carrying out day to day duties. The ideal candidate will work closely with cross functional teams to implement, test, maintain and deploy different DevOps tools."
                  );
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
