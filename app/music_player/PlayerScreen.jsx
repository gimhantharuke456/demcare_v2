import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { Audio } from "expo-av";
import Container from "../../components/Container";
import Title from "../../components/Title";
import { fetchAudio } from "../../services/music_service";
import { useRouter } from "expo-router";
import LoadingIndicator from "../../components/Loading";
import { saveInStorage } from "../../services/local_storage_service";
import ImageCarousel from "../../components/ImageCarausel";

const PlayerScreen = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const finishAlert = () => {
    Alert.alert(
      "Hey",
      "Do you want to listen to this music again?",
      [
        {
          text: "Yes",
          onPress: async () => {
            await playSound();
            setIsPlaying(true);
          },
        },
        {
          text: "No",
          onPress: async () => {
            try {
              await saveInStorage("CURRENT_EMOTION", "");

              router.push("/audio_diary/AudioDiaryHome");
            } catch (error) {
              console.log(error);
            }
          },
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    setLoading(true);
    fetchAudio()
      .then(async (audios) => {
        const randomIndex = Math.floor(Math.random() * audios.length);
        const item = audios[randomIndex];
        if (item) {
          const url = item.getUrl();
          console.log(`music player going to play ${url}`);
          const { sound } = await Audio.Sound.createAsync({ uri: url });
          setSound(sound);
          setLoading(false);
        } else {
          console.log("url not found");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(`fetch audio from front failed ${err}`);
        setLoading(false);
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

  const onPlaybackStatusUpdate = async (status) => {
    console.log(`${isPlaying}`);
    if (status.durationMillis === status.positionMillis && !isPlaying) {
      setIsPlaying(false);
      finishAlert();
    }
  };

  const playSound = async () => {
    setIsPlaying(true);
    await sound.playAsync();
    console.log("song is playing");
    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const onSliderValueChange = (value) => {
    console.log(value);
    if (sound && duration) {
      sound.setPositionAsync(value * duration);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Container
      child={
        <View style={{ flex: 1, alignItems: "center" }}>
          <Title />

          <ImageBackground
            style={styles.imageWrapper}
            source={require("../../assets/music.png")}
          >
            <View style={styles.imageWrapper}>
              <ImageCarousel />
            </View>
          </ImageBackground>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={() => {
              console.log(`currently music state ${isPlaying}`);
              if (isPlaying) {
                pauseSound();
              } else {
                playSound();
              }
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {isPlaying ? "Pause" : "Play"}
            </Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  slider: {
    width: "80%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#5BD2EC",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  imageWrapper: {
    width: 400,
    height: 350,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  image: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
});

export default PlayerScreen;
