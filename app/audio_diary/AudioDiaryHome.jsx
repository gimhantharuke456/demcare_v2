import Container from "../../components/Container";
import { View } from "react-native";
import Title from "../../components/Title";
import { AuthStartStyles } from "../../styles/AuthStartStyles";
import CustomIconButton from "../../components/CustomIconButton";
import { useRouter } from "expo-router";
const AudioDiaryHome = () => {
  const router = useRouter();
  const route =(path)=>{
    router.push(`/audio_diary/${path}`);
  }
  return (
    <Container
      child={
        <View style={{ flex: 1, alignItems: "center" }}>
          <Title />
          <View style={{ ...AuthStartStyles.card }}>
            <CustomIconButton onPress={() => {route("RecordPage")}} icon={"mic"} />
            <CustomIconButton onPress={() => {route("RecordedLists")}} icon={"copy"} />
            <CustomIconButton onPress={() => {route("AudioListPage")}} icon={"calendar"} />
          </View>
        </View>
      }
    />
  );
};

export default AudioDiaryHome;
