import React, { useState } from "react";
import {
  View,
  Image,
  TouchableHighlight,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import Container from "../../components/Container";
import Title from "../../components/Title";
import { AuthStartStyles } from "../../styles/AuthStartStyles";
import { Stopwatch } from "react-native-stopwatch-timer";
import { Audio } from "expo-av";
import Button from "../../components/Button";
import { useNavigation } from "expo-router";
import {
  addSummary,
  convertToText,
  saveConvertedText,
  summerizeText,
  uploadAudioFile,
} from "../../services/summarize_service";
import LoadingIndicator from "../../components/Loading";
import { getFromStorage } from "../../services/local_storage_service";
const RecordPage = () => {
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);
  const [recording, setRecording] = useState(false);
  const [loding, setLoading] = useState(false);
  const [convertedText, setConvertedText] = useState("");
  const [summeriseText, setSummriseText] = useState("");
  const [recorededText,setRecorededText] = useState("")
  const [uri, setUri] = useState("");
  const path = require("../../assets/mic.png");
  const navigate = useNavigation();
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
    } else {
      console.log("recording is null");
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
          {!summeriseText && !convertedText && (
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
          )}
          {convertedText && !summeriseText && (
            <View
              style={{
                ...AuthStartStyles.card,
                width: "90%",
              }}
            >
              <Text style={{ fontSize: 24 }}>Converted Text</Text>
              <Text style={{ marginTop: 8, fontSize: 18 }}>
                {convertedText}
              </Text>
            </View>
          )}
          {summeriseText && (
            <View
              style={{
                ...AuthStartStyles.card,
                width: "90%",
              }}
            >
              <Text style={{ fontSize: 24 }}>Summerize Text</Text>
              <View style={{ height: 16 }} />
              <ScrollView>
                <Text style={{ fontSize: 18 }}>{summeriseText}</Text>
              </ScrollView>
            </View>
          )}
          {!convertedText && !summeriseText && (
            <Button
              text={"Convert to text"}
              onPressed={async () => {
                try {
                  setLoading(true);
                  setIsStopwatchStart(false);
                  const url = await stopRecording();

                  if (uri) {
                    const result = await uploadAudioFile(uri);

                    if (result) {
                      const t = await convertToText(result);
                      setConvertedText(t);
                      //  Alert.alert("Success", "Audio uploaded successfully!");
                    } else {
                      Alert.alert("Error", "Audio uploading failed!");
                    }
                  }
                  setLoading(false);
                } catch (err) {
                  Alert.alert("Error", `${err}`);
                  setLoading(false);
                }
              }}
            />
          )}
          {convertedText && (
            <Button
              text={"Save to later"}
              onPressed={async () => {
                setLoading(true);
                const url = await getFromStorage("url");
                await saveConvertedText(url, convertedText,);
                setLoading(false);
                Alert.alert(
                  "Success",
                  "Your summerization uploaded successfully!"
                );
                navigate.goBack();
              }}
            />
          )}
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
