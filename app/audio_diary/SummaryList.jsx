import React, { useEffect, useState } from 'react'
import Container from "../../components/Container"
import { View, FlatList, Text } from 'react-native'
import Title from "../../components/Title"
import LoadingIndicator from "../../components/Loading"
import { getFromStorage, saveInStorage } from "../../services/local_storage_service"
import { getSummaries, deleteSummary } from "../../services/summarize_service"
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router'
const SummaryList = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [summaries, setSummaries] = useState([])
    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        await getFromStorage("selected_date").then((date) => {
            if (date) {
                setLoading(true)
                getSummaries(date).then((summaries) => {
                    setSummaries(summaries)
                })
                setLoading(false)
            } else {
                console.log("date not found")
            }
        })
    }
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
                {" "}
                {item.date}{" "}
            </Text>
            <TouchableOpacity
                onPress={async () => {
                    await deleteSummary(item.id);
                    await getData()
                }}
            >
                <MaterialIcons name="delete" size={36} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={async () => {
                    await saveInStorage("selected_summary", item.summary)
                    router.push("/audio_diary/Summary")
                }}
            >
                <AntDesign name="eye" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
    if (loading) {
        return <LoadingIndicator />
    }
    return (
        <Container
            child={<View style={{ flex: 1, alignItems: "center" }}>
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
            </View>}
        />
    )
}

export default SummaryList