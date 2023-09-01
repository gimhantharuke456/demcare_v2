import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import Container from "../../components/Container";
import Title from "../../components/Title";
import { fetchAudio } from "../../services/music_service";
import { useRouter } from "expo-router";
import LoadingIndicator from "../../components/Loading";
import { saveInStorage } from "../../services/local_storage_service";
import ImageCarousel from "../../components/ImageCarausel";
//import ImageCarausel from "../../components/ImageCarausel";

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
      "Do you want to listen this music again ?",
      [
        {
          text: "Yes",
          onPress: () => {
            playSound();
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
  useEffect(() => {
    setLoading(true);
    fetchAudio()
      .then(async (audios) => {
        const randomIndex = Math.floor(Math.random() * audios.length);
        const item = audios[randomIndex];
        if (item) {
          const url = item.getUrl();
          const { sound } = await Audio.Sound.createAsync({ uri: url });
          setSound(sound);
          sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        } else {
          console.log("url not found");
        }
        setLoading(false);
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

  const onPlaybackStatusUpdate = (status) => {
    if (status.durationMillis === status.positionMillis) {
      setIsPlaying(false);
      finishAlert();
    }
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

          <View style={styles.imageWrapper}>
            <ImageCarousel />
          </View>
          <TouchableOpacity
            onPress={!isPlaying ? playSound : pauseSound}
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
    width: 350,
    height: 350,
  },
  image: {
    resizeMode: "cover",
    width: 350,
    height: 350,
  },
});

export default PlayerScreen;
