import React, { useEffect, useRef, useState } from "react";
import Container from "../../components/Container";
import { View, Dimensions, StyleSheet, Image, Text } from "react-native";
import Title from "../../components/Title";
import { Camera, CameraType } from "expo-camera";
import Button from "../../components/Button";
import * as FaceDetector from "expo-face-detector";
import LoadingIndicator from "../../components/Loading";
import { predictEmotion } from "../../services/emotion_service";
import { useRouter } from "expo-router";
import { saveInStorage } from "../../services/local_storage_service";
const ScanPage = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [image, setImage] = useState(null);
  const [predictedEmotionFromApi, setPredictedEmotion] = useState(null);
  const cameraRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status == "granted");
    })();
  }, []);

  const takePic = async () => {
    if (image) {
      setImage(null);
    }
    const options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setImage(newPhoto);
    if (image) {
      console.log("phot picked");
    }
  };

  const pE = async () => {
    setShouldLoad(true);
    try {
      let filename = image.uri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append("image", {
        uri: image.uri,
        name: filename,
        type: type,
      });
      const emotion = await predictEmotion(formData);
      setPredictedEmotion(emotion);
    } catch (error) {
      console.log(`predict emotion failed from  front end ${error}`);
    }
    setShouldLoad(false);
  };

  if (shouldLoad) {
    return <LoadingIndicator />;
  }

  if (predictedEmotionFromApi) {
    return (
      <Container
        child={
          <View style={{ flex: 1, alignItems: "center" }}>
            <Title />
            <View style={styles.camera}>
              <Image
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
                source={{ uri: "data:image/jpg;base64," + image.base64 }}
              />
            </View>
            <Text
              style={{
                color: "black",
                fontWeight: "700",
                fontSize: 32,
              }}
            >
              {" "}
              Predicted Emotion : {predictedEmotionFromApi}{" "}
            </Text>
            <Button text={"Listen to Music"} onPressed={async() => {
              await saveInStorage("CURRENT_EMOTION",predictedEmotionFromApi.toLowerCase());
              router.push("/music_player/PlayerScreen")
            }} />
            <Button text={"Scan Again"} onPressed={() => {
              takePic()
              setPredictedEmotion(null);
            }} />
          </View>
        }
      />
    );
  }

  return (
    <Container
      child={
        <View style={{ flex: 1, alignItems: "center" }}>
          <Title />
          {image ? (
            <View style={styles.camera}>
              <Image
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
                source={{ uri: "data:image/jpg;base64," + image.base64 }}
              />
            </View>
          ) : (
            <Camera
              faceDetectorSettings={{
                mode: FaceDetector.FaceDetectorMode.fast,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
                runClassifications:
                  FaceDetector.FaceDetectorClassifications.none,
                minDetectionInterval: 100,
                tracking: true,
              }}
              style={styles.camera}
              type={CameraType.front}
              ref={cameraRef}
            >
              <View></View>
            </Camera>
          )}
          <Button
            text={"SCAN"}
            onPressed={() => {
              takePic();
            }}
          />
          {image && (
            <Button
              text={"SEND"}
              onPressed={() => {
                pE();
              }}
            />
          )}
        </View>
      }
    />
  );
};

export default ScanPage;

const styles = StyleSheet.create({
  camera: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").width * 0.8 * (4 / 3),
    borderRadius: 10,
    overflow: "hidden",
  },
});
