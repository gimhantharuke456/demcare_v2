import { FlatList, View, Text } from "react-native";
import Container from "../../components/Container";
import Title from "../../components/Title";
import { useEffect, useState } from "react";
import LoadingIndicator from "../../components/Loading";
import { getSummaries } from "../../services/summarize_service";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  saveInStorage,
  getFromStorage,
} from "../../services/local_storage_service";
import { auth } from "../../firebaseConfig";
const CareGiverMemmoris = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const getData = async () => {
    setLoading(true);
    getSummaries()
      .then((summaries) => {
        setSummaries(summaries);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);
  console.log(auth.currentUser?.uid);
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
      <FontAwesome name="sticky-note-o" size={24} color="black" />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#000080",
        }}
      >
        {item.date}
      </Text>
      <TouchableOpacity
        onPress={async () => {
          await deleteSummary(item.id);
          await getData();
        }}
      >
        <MaterialIcons name="delete" size={36} color="red" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          const isPatient = await getFromStorage("USER_TYPE");

          const t = isPatient === "PATIENT" ? item.summary : item.text;
          console.log(t);
          await saveInStorage("selected_summary", t);
          router.push("/audio_diary/Summary");
        }}
      >
        <AntDesign name="eye" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <Container
      child={
        <View style={{ flex: 1, alignItems: "center" }}>
          <Title />
          <View style={{ height: 600, width: 350 }}>
            <FlatList
              data={summaries}
              renderItem={renderListItem}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={() => (
                <View style={{ marginVertical: 16, alignItems: "center" }}>
                  <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                    Your Memmories
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      }
    />
  );
};

export default CareGiverMemmoris;
