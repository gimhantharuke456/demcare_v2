import React, { useState } from "react";
import {
  View,
  Image,
  TouchableHighlight,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import Container from "../../components/Container";
import Title from "../../components/Title";
import { AuthStartStyles } from "../../styles/AuthStartStyles";
import { Stopwatch } from "react-native-stopwatch-timer";
import { Audio } from "expo-av";
import Button from "../../components/Button";
import { uploadAudioFile } from "../../services/summarize_service";
import LoadingIndicator from "../../components/Loading";
import Voice from "@react-native-voice/voice";
const RecordPage = () => {
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);
  const [recording, setRecording] = useState(false);
  const [loding, setLoading] = useState(false);
  const [uri, setUri] = useState("");
  const path = require("../../assets/mic.png");

  const startRecording = async () => {
    try {
      setRecording(undefined);
      console.log("request permision");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Start recording ...");
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.log(`record audi failed ${err}`);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      console.log("Stopping record");
      await recording.stopAndUnloadAsync();
      const u = recording.getURI();
      setUri(u);

      setRecording(undefined);
      return u;
    }
  };

  if (loding) {
    return <LoadingIndicator />;
  }

  return (
    <Container
      child={
        <View style={{ flex: 1, alignItems: "center" }}>
          <Title />
          <View style={AuthStartStyles.card}>
            <Image
              style={{
                width: 250,
                height: 250,
                resizeMode: "cover",
              }}
              source={path}
            />
            <Stopwatch
              laps={true}
              msecs={true}
              start={isStopwatchStart}
              reset={resetStopwatch}
              options={options}
              getTime={(time) => {}}
            />
            <TouchableHighlight
              onPress={() => {
                setIsStopwatchStart(!isStopwatchStart);
                if (isStopwatchStart) {
                  stopRecording();
                } else {
                  startRecording();
                }
                setResetStopwatch(false);
              }}
            >
              <Text style={styles.buttonText}>
                {!isStopwatchStart ? "START" : "STOP"}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                setIsStopwatchStart(false);
                setResetStopwatch(true);
                setRecording(undefined);
              }}
            >
              <Text style={styles.buttonText}>RESET</Text>
            </TouchableHighlight>
          </View>

          <Button
            text={"Save to summarize"}
            onPressed={async () => {
              try {
                if (recording) {
                  setLoading(true);
                  setIsStopwatchStart(false);
                  const url = await stopRecording();

                  const result = await uploadAudioFile(url);
                  if (result) {
                    Alert.alert("Success", "Audio uploaded successfully!");
                  } else {
                    console.log("result is false");
                  }
                  setLoading(false);
                }
              } catch (err) {
                console.log(err);
              }
            }}
          />
        </View>
      }
    />
  );
};

export default RecordPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
  sectionStyle: {
    flex: 1,
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    marginTop: 10,
  },
});

const options = {
  container: {
    padding: 5,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    color: "#4FB9D0",
    fontWeight: "bold",
    marginLeft: 7,
  },
};
