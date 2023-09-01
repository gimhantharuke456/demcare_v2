import React, { useEffect, useState } from "react";
import Container from "../../components/Container";
import { View, FlatList, Text } from "react-native";
import Title from "../../components/Title";
import { List } from "react-native-paper";
import {
  deleteConvertedText,
  deleteDiary,
  getConvertedTexts,
  getDiaries,
} from "../../services/summarize_service";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import LoadingIndicator from "../../components/Loading";
import { useRouter } from "expo-router";
import { saveInStorage } from "../../services/local_storage_service";
const RecordedLists = () => {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      setLoad(true);
      setData([]);
      const t = await getConvertedTexts();
      setData(t);
      setLoad(false);
    })();
  }, []);

  const renderListItem = ({ item }) => (
    <View
      style={{
        height: 80,
        widht: 350,
        backgroundColor: "white",
        elevation: 1,
        marginVertical: 4,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        padding: 16,
      }}
      key={item.id}
    >
      <Ionicons name="musical-note-outline" size={48} color="green" />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#000080",
        }}
      >
        {" "}
        {dateConverter(item.uploaded_at)}{" "}
      </Text>
      <TouchableOpacity
        onPress={async () => {
          setLoad(true);
          await deleteConvertedText(item.id);
          setData([]);
          const t = await getDiaries();
          setData(t);
          setLoad(false);
        }}
      >
        <MaterialIcons name="delete" size={36} color="red" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          await saveInStorage("SELECTED_URL", item.url);
          await saveInStorage("SELECTED_CONVERTED_TEXT", item.text);
          router.push("/audio_diary/ProcessAudioPage");
        }}
      >
        <MaterialIcons name="play-arrow" size={36} color="blue" />
      </TouchableOpacity>
    </View>
  );
  const dateConverter = (date) => {
    return moment(date).format("DD-MM-YYYY h:mm:ss");
  };

  if (load) {
    return <LoadingIndicator />;
  }

  return (
    <Container
      child={
        <View style={{ flex: 1, alignItems: "center" }}>
          <Title />
          {data.length <= 0 ? (
            <View>
              <Text>No Records</Text>
            </View>
          ) : (
            <View style={{ height: 600, width: 350 }}>
              <FlatList
                data={data}
                renderItem={renderListItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={() => (
                  <View style={{ marginVertical: 16, alignItems: "center" }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                      Your Recordings
                    </Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      }
    />
  );
};

export default RecordedLists;
